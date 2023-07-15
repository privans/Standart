
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
