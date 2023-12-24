
if ( typeof process !== 'undefined' && process.env )
{
	//import "fake-indexeddb/auto";
	require('fake-indexeddb/auto');
}

import _ from "lodash";
import { VaChatRoomMember } from "../validators/VaChatRoomMember";
import { ChatRoomEntityItem, ChatRoomMember, ChatRoomMembers } from "../entities/ChatRoomEntity";
import { AbstractStorageService } from "./AbstractStorageService";
import { IStorageService } from "./IStorageService";
import { EtherWallet } from "debeem-id";
import { VaChatRoomEntityItem } from "../validators/VaChatRoomEntityItem";


/**
 * 	@class
 */
export class ChatRoomStorageService extends AbstractStorageService<ChatRoomEntityItem> implements IStorageService
{
	constructor( password : string = '' )
	{
		super( 'debeem_chat_room_entity', password );
	}

	/**
	 *	@param value	{string}
	 *	@param pinCode	{string}
	 *	@returns {Promise<string>}
	 */
	public encryptPassword( value ?: string, pinCode ?: string ) : Promise<string>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! value )
				{
					value = '';
				}
				if ( ! pinCode )
				{
					pinCode = '';
				}

				const valueObj = { value : value };
				const encrypted : string = await this.storageCrypto.encryptFromObject( valueObj, pinCode );
				resolve( encrypted );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 *	@param encryptedPassword	{string}
	 *	@param pinCode			{string}
	 *	@returns {Promise<string>}
	 */
	public decryptPassword( encryptedPassword : string, pinCode : string ) : Promise<string>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! encryptedPassword )
				{
					return reject( `${ this.constructor.name } :: invalid encryptedPassword` );
				}

				const valueObj : any = await this.storageCrypto.decryptToObject( encryptedPassword, pinCode );
				if ( valueObj && valueObj.value )
				{
					return resolve( valueObj.value );
				}

				//	...
				reject( `${ this.constructor.name } :: failed to decrypt` );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 *	@param item	{any}
	 *	@returns {string | null}
	 */
	public isValidItem( item : any ) : string | null
	{
		return VaChatRoomEntityItem.validateChatRoomEntityItem( item );
	}

	/**
	 *	@param key	{any}
	 *	@returns {boolean}
	 */
	public isValidKey( key : any ) : boolean
	{
		if ( ! _.isString( key ) || _.isEmpty( key ) || ! key.includes( "." ) )
		{
			return false;
		}

		const arr : Array<string> = key.split( "." );
		return Array.isArray( arr ) && 2 === arr.length &&
			null === VaChatRoomEntityItem.isValidWallet( arr[ 0 ] ) &&
			null === VaChatRoomEntityItem.isValidRoomId( arr[ 1 ] );
	}

	/**
	 * 	get the storage key
	 *	@param value	{ChatRoomEntityItem}
	 *	@returns {string | null}
	 */
	public getKeyByItem( value : ChatRoomEntityItem ) : string | null
	{
		const errorItem = this.isValidItem( value );
		if ( null === errorItem )
		{
			return `${ value.wallet.trim().toLowerCase() }.${ value.roomId.trim().toLowerCase() }`;
		}
		console.error( `${ this.constructor.name } :: `, errorItem );

		return null;
	}

	/**
	 * 	get the storage key
	 * 	@param wallet	{string}
	 * 	@param roomId	{string}
	 * 	@returns {string | null}
	 */
	public getKeyByWalletAndRoomId( wallet : string, roomId : string ) : string | null
	{
		const errorWallet : string | null = VaChatRoomEntityItem.isValidWallet( wallet );
		if ( null !== errorWallet )
		{
			console.error( `${ this.constructor.name } :: `, errorWallet );
			return null;
		}

		const errorRoomId : string | null = VaChatRoomEntityItem.isValidRoomId( roomId );
		if ( null !== errorRoomId )
		{
			console.error( `${ this.constructor.name } :: `, errorRoomId );
			return null;
		}

		return `${ wallet.trim().toLowerCase() }.${ roomId.trim().toLowerCase() }`;
	}

	/**
	 *	Put an item into the database, and will replace the item with the same key.
	 *	@param key
	 *	@param value
	 *	@returns {Promise<boolean>}
	 */
	public async put( key: string, value : ChatRoomEntityItem ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! this.isValidKey( key ) )
				{
					return reject( `${ this.constructor.name } :: invalid key for :put` );
				}

				const errorItem : string | null = this.isValidItem( value );
				if ( null !== errorItem )
				{
					return reject( errorItem );
				}

				if ( ! value.timestamp )
				{
					value.timestamp = new Date().getTime();
				}

				//	...
				resolve( await super.put( key, value ) );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}


	/**
	 *	@param key	{string} room id
	 *	@returns {Promise<ChatRoomMembers | null>}
	 */
	public getMembers( key: string ) : Promise<ChatRoomMembers | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! this.isValidKey( key ) )
				{
					return reject( `${ this.constructor.name } :: invalid key for :getMembers` );
				}

				let item : ChatRoomEntityItem | null = await this.get( key );
				if ( ! item )
				{
					return reject( `item not found by key: ${ key }` );
				}

				return resolve( item.members );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 *	@param key		{string} room id
	 *	@param memberWallet	{string} wallet address
	 *	@returns {Promise<ChatRoomMember | null>}
	 */
	public getMember( key: string, memberWallet : string ) : Promise<ChatRoomMember | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! this.isValidKey( key ) )
				{
					return reject( `${ this.constructor.name } :: invalid key for :getMember` );
				}
				if ( ! _.isString( memberWallet ) || _.isEmpty( memberWallet ) )
				{
					return reject( `invalid memberWallet` );
				}
				if ( ! EtherWallet.isValidAddress( memberWallet ) )
				{
					return reject( `invalid memberWallet, invalid address` );
				}

				let item : ChatRoomEntityItem | null = await this.get( key );
				if ( ! item )
				{
					return reject( `item not found by key: ${ key }` );
				}

				memberWallet = memberWallet.trim().toLowerCase();
				if ( item.members &&
					_.has( item.members, memberWallet ) )
				{
					const member : ChatRoomMember = item.members[ memberWallet ];
					return resolve( member );
				}

				//	...
				resolve( null );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 *	@param key	{string}	- key/roomId
	 *	@param member	{ChatRoomMember}
	 *	@returns {Promise<boolean>}
	 */
	public putMember( key: string, member : ChatRoomMember )  : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! this.isValidKey( key ) )
				{
					return reject( `${ this.constructor.name } :: invalid key for :putMember` );
				}

				//	validate member
				const errorChatRoomMember : string | null = VaChatRoomMember.validateChatRoomMember( member );
				if ( null !== errorChatRoomMember )
				{
					return reject( errorChatRoomMember );
				}

				//	...
				let item : ChatRoomEntityItem | null = await this.get( key );
				if ( ! item )
				{
					return reject( `item not found by key: ${ key }` );
				}

				if ( ! item.members )
				{
					item.members = {};
				}
				member.wallet = member.wallet.trim().toLowerCase();
				if ( ! member.timestamp )
				{
					member.timestamp = new Date().getTime();
				}
				item.members[ member.wallet ] = member;

				//	...
				const saved : boolean = await this.put( key, item );
				resolve( saved );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 *	@param key		{string}
	 *	@param memberWallet	{string}
	 *	@returns {Promise<boolean>}
	 */
	public deleteMember( key: string, memberWallet : string ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! this.isValidKey( key ) )
				{
					return reject( `${ this.constructor.name } :: invalid key for :deleteMember` );
				}
				if ( ! _.isString( memberWallet ) || _.isEmpty( memberWallet ) )
				{
					return reject( `invalid memberWallet` );
				}
				if ( ! EtherWallet.isValidAddress( memberWallet ) )
				{
					return reject( `invalid memberWallet, invalid address` );
				}

				let item : ChatRoomEntityItem | null = await this.get( key );
				if ( ! item )
				{
					return reject( `item not found by key: ${ key }` );
				}

				memberWallet = memberWallet.trim().toLowerCase();
				if ( item.members &&
					_.has( item.members, memberWallet ) )
				{
					delete item.members[ memberWallet ];
					const saved : boolean = await this.put( key, item );
					return resolve( saved );
				}

				//	...
				resolve( false );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}
}