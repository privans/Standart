
import _ from "lodash";
import { ChatRoomEntityItem, ChatRoomMember, ChatRoomMembers, ChatRoomMemberType } from "./entities/ChatRoomEntity";
import { CreateChatRoom } from "./models/rooms/CreateChatRoom";
import { VaCreateChatRoom } from "./validators/VaCreateChatRoom";
import { ChatRoomStorageService } from "./storages/ChatRoomStorageService";
import { clientInviteRequestInitV1, InviteRequest } from "./models/rooms/InviteRequest";
import { VaChatRoomEntityItem } from "./validators/VaChatRoomEntityItem";
import { EtherWallet } from "debeem-id";
import { RoomUtil } from "./utils/RoomUtil";
import { VaChatRoomMember } from "./validators/VaChatRoomMember";
import { isAddress, isHexString } from "ethers";
import { ChatType } from "./models/messages/SendMessageRequest";
import { ConditionCallback } from "./storages/IStorageService";
import { PaginationOptions, PaginationOrder } from "./models/PaginationOptions";
import { TypeUtil } from "debeem-utils";

/**
 * 	@class
 */
export class ClientRoom
{
	public readonly chatRoomStorageService ! : ChatRoomStorageService;

	constructor()
	{
		this.chatRoomStorageService = new ChatRoomStorageService( `` );
	}

	/**
	 * 	create chat room
	 *	@param createChatRoomOptions	{CreateChatRoom}
	 *	@returns {Promise<ChatRoomEntityItem>}
	 */
	public createRoom( createChatRoomOptions : CreateChatRoom ) : Promise<ChatRoomEntityItem>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const errorCreateChatRoom : string | null = VaCreateChatRoom.validateCreateChatRoom( createChatRoomOptions );
				if ( null !== errorCreateChatRoom )
				{
					return reject( `ClientRoom.createRoom :: ${ errorCreateChatRoom }` );
				}

				if ( null !== VaCreateChatRoom.isValidEncryptionKey( createChatRoomOptions.encryptionKey ) )
				{
					createChatRoomOptions.encryptionKey = RoomUtil.generateRandomEncryptionKey();
				}
				if ( null !== VaChatRoomEntityItem.isValidRoomId( createChatRoomOptions.roomId ) )
				{
					createChatRoomOptions.roomId = RoomUtil.generateRandomRoomId( createChatRoomOptions.chatType );
				}

				//	...
				const passwordValue = await this.chatRoomStorageService.encryptPassword( createChatRoomOptions.encryptionKey, createChatRoomOptions.pinCode );
				const item : ChatRoomEntityItem = {
					wallet : createChatRoomOptions.wallet,
					chatType : createChatRoomOptions.chatType,
					name : createChatRoomOptions.name,
					roomId : String( createChatRoomOptions.roomId ),
					desc : createChatRoomOptions.desc,
					password : passwordValue,
					timestamp : new Date().getTime(),
					members : createChatRoomOptions.members
				};
				const key : string | null = this.chatRoomStorageService.getKeyByItem( item );
				if ( ! _.isString( key ) || _.isEmpty( key ) )
				{
					return reject( `ClientRoom.createRoom :: failed to get storage key` );
				}

				await this.chatRoomStorageService.put( key, item );
				resolve( item );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 *	@param wallet	{string}
	 *	@param roomId	{string}
	 *	@returns {Promise<boolean>}
	 */
	public deleteRoom( wallet : string, roomId : string ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const key : string = this.getStorageKey( wallet, roomId );
				if ( ! _.isString( key ) || _.isEmpty( key ) )
				{
					return reject( `ClientRoom.deleteRoom :: failed to get storage key` );
				}

				const saved : boolean = await this.chatRoomStorageService.delete( key );
				resolve( saved );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	@param wallet	{string}
	 * 	@param roomId	{string}
	 *	@returns {Promise<ChatRoomEntityItem | null>}
	 */
	public queryRoom( wallet : string, roomId : string ) : Promise< ChatRoomEntityItem | null >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const key : string = this.getStorageKey( wallet, roomId );
				if ( ! _.isString( key ) || _.isEmpty( key ) )
				{
					return reject( `ClientRoom.queryRoom :: failed to get storage key` );
				}

				const roomItem : ChatRoomEntityItem | null = await this.chatRoomStorageService.get( key );
				resolve( roomItem );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}


	/**
	 * 	@param [wallet] 	{string}
	 *	@returns {Promise< Array<ChatRoomEntityItem> >}
	 */
	public queryRooms( wallet ?: string ) : Promise< Array<ChatRoomEntityItem> >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const conditionCallback : ConditionCallback = ( _key : string, item : any, _index : number ) : boolean =>
				{
					if ( isAddress( wallet ) )
					{
						return item &&
							isAddress( item.wallet ) &&
							0 === wallet.trim().toLowerCase().localeCompare( item.wallet.trim().toLowerCase() );
					}

					//	will return all records
					return true;
				};
				const paginationOptions : PaginationOptions = {
					pageNo : 1,
					pageSize : 1000,
					order : PaginationOrder.ASC
				};
				const rooms : Array<ChatRoomEntityItem | null> | null = await this.chatRoomStorageService.query( conditionCallback, paginationOptions );
				if ( ! rooms || ! Array.isArray( rooms ) || 0 === rooms.length )
				{
					return resolve( [] );
				}

				let roomList : Array<ChatRoomEntityItem> = [];
				for ( const item of rooms )
				{
					if ( _.isObject( item ) )
					{
						roomList.push( item );
					}
				}

				resolve( roomList );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	create an invitation to invite member
	 *	@param wallet	{string}
	 *	@param roomId	{string}
	 *	@returns {InviteRequest | null}
	 */
	public inviteMember( wallet : string, roomId : string ) : Promise<InviteRequest | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const key : string = this.getStorageKey( wallet, roomId );
				const roomItem : ChatRoomEntityItem | null = await this.chatRoomStorageService.get( key );
				//console.log( `inviteMember roomItem :`, _.cloneDeep( roomItem ) );
				if ( ! roomItem )
				{
					return reject( `${ this.constructor.name } :: room not found` );
				}
				if ( ! _.isObject( roomItem.members ) || _.isEmpty( roomItem.members ) )
				{
					return reject( `${ this.constructor.name } :: invalid members` );
				}

				//	build
				let invite : InviteRequest = _.cloneDeep( clientInviteRequestInitV1 );
				invite.chatRoom = _.cloneDeep( roomItem );

				//
				//	only keep the owner alone
				//
				let owner : ChatRoomMember | null = RoomUtil.matchRoomOwner( invite.chatRoom.members );
				if ( ! _.isObject( owner ) || _.isEmpty( owner ) )
				{
					return reject( `${ this.constructor.name } :: owner not found` );
				}
				if ( ChatType.PRIVATE === roomItem.chatType )
				{
					// if ( Object.keys( roomItem.members ).length >= 2 )
					// {
					// 	return reject( `${ this.constructor.name } :: number of members reached the upper limit for creating invitation` );
					// }
					if ( ! isHexString( owner.publicKey, 33 ) )
					{
						return reject( `${ this.constructor.name } :: invalid owner's publicKey` );
					}
					// if ( 0 !== owner.wallet.trim().toLowerCase().localeCompare( wallet.trim().toLowerCase() ) )
					// {
					// 	return reject( `${ this.constructor.name } :: only owner can create invitation` );
					// }
				}

				//	put the owner as member
				owner.wallet = owner.wallet.trim().toLowerCase();
				invite.chatRoom.members = {
					[ owner.wallet ] : owner
				}

				//	put my as member
				const my : ChatRoomMember | null = RoomUtil.matchRoomMemberByWallet( roomItem.members, wallet );
				//console.log( `inviteMember my :`, my );
				if ( my )
				{
					const errorMy : string | null = VaChatRoomMember.validateChatRoomMember( my );
					//console.log( `inviteMember my : errorMy :`, errorMy );
					if ( my && null === errorMy )
					{
						//console.log( `inviteMember my : validated okay!` );
						wallet = wallet.trim().toLowerCase();
						invite.chatRoom.members[ wallet ] = my;
					}
				}

				//	...
				return resolve( invite );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	accept invitation
	 *	@param inviteString	{string}		- the chat room and member information this invitation was sent from
	 *	@param member		{ChatRoomMember}	- user currently accepting invitations
	 *	@returns {Promise<ChatRoomEntityItem>}
	 */
	public acceptInvitation( inviteString : string, member : ChatRoomMember ) : Promise<ChatRoomEntityItem>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const errorMember : string | null = VaChatRoomMember.validateChatRoomMember( member );
				if ( null !== errorMember )
				{
					return reject( errorMember );
				}

				const invite : InviteRequest = JSON.parse( inviteString );
				if ( ! invite || invite.header !== clientInviteRequestInitV1.header )
				{
					return reject( `${ this.constructor.name }.acceptInvitation :: invalid inviteString` );
				}

				if ( ! _.isObject( invite.chatRoom.members ) || _.isEmpty( invite.chatRoom.members ) )
				{
					return reject( `${ this.constructor.name }.acceptInvitation :: invalid invite.chatRoom.members` );
				}

				//	check if room exists
				const roomItem : ChatRoomEntityItem | null = await this.queryRoom( member.wallet, invite.chatRoom.roomId );
				const roomExists : boolean = ( _.isObject( roomItem ) && ! _.isEmpty( roomItem ) );

				let owner = RoomUtil.matchRoomOwner( invite.chatRoom.members );
				if ( ! _.isObject( owner ) || _.isEmpty( owner ) )
				{
					return reject( `${ this.constructor.name }.acceptInvitation :: owner not found` );
				}
				if ( null !== VaChatRoomMember.validateChatRoomMember( owner ) )
				{
					return reject( `${ this.constructor.name }.acceptInvitation :: invalid owner` );
				}

				if ( ChatType.PRIVATE === invite.chatRoom.chatType )
				{
					if ( ! isHexString( owner.publicKey, 33 ) )
					{
						return reject( `${ this.constructor.name }.acceptInvitation :: invalid owner's publicKey` );
					}
					if ( ! isHexString( member.publicKey, 33 ) )
					{
						return reject( `${ this.constructor.name }.acceptInvitation :: invalid member's publicKey` );
					}
					if ( roomExists )
					{
						if ( 0 === owner.wallet.trim().toLowerCase().localeCompare( member.wallet.trim().toLowerCase() ) )
						{
							return reject( `${ this.constructor.name }.acceptInvitation :: unable to add yourself by wallet` );
						}
						if ( 0 === owner.publicKey.trim().toLowerCase().localeCompare( member.publicKey.trim().toLowerCase() ) )
						{
							return reject( `${ this.constructor.name }.acceptInvitation :: unable to add yourself by publicKey` );
						}
					}
				}
				else if ( ChatType.GROUP === invite.chatRoom.chatType )
				{
					if ( owner.wallet.trim().toLowerCase() === member.wallet.trim().toLowerCase() )
					{
						return reject( `${ this.constructor.name }.acceptInvitation :: unable to add yourself` );
					}
				}
				else
				{
					return reject( `${ this.constructor.name }.acceptInvitation :: unsupported .chatType` );
				}


				//
				//	put member to invite.chatRoom.members
				//
				const memberIsOwner = TypeUtil.isStringEqualNoCase( member.wallet, owner.wallet );
				member.wallet = member.wallet.trim().toLowerCase();
				invite.chatRoom.members[ member.wallet ] = {
					...member,
					memberType : memberIsOwner ? ChatRoomMemberType.OWNER : ChatRoomMemberType.MEMBER,
				};

				//
				//	save the room to database
				//
				const item : ChatRoomEntityItem = {
					wallet : member.wallet,
					chatType : invite.chatRoom.chatType,
					name : invite.chatRoom.name,
					roomId : invite.chatRoom.roomId,
					desc : invite.chatRoom.desc,
					password : invite.chatRoom.password,
					timestamp : invite.chatRoom.timestamp,
					members : invite.chatRoom.members,
				};

				const errorItem : string | null = VaChatRoomEntityItem.validateChatRoomEntityItem( item );
				if ( null !== errorItem )
				{
					return reject( errorItem );
				}

				const key : string | null = this.chatRoomStorageService.getKeyByItem( item );
				if ( ! _.isString( key ) || _.isEmpty( key ) )