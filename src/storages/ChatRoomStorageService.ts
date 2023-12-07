
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