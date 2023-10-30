
import { ChatRoomEntityItem } from "../entities/ChatRoomEntity";
import _ from "lodash";
import { ChatType } from "../models/messages/SendMessageRequest";
import { AesCrypto } from "debeem-cipher";
import { ChatRoomStorageService } from "../storages/ChatRoomStorageService";

/**
 * 	@class
 */
export class GroupMessageCrypto
{
	chatRoomStorageService : ChatRoomStorageService = new ChatRoomStorageService( `` );

	/**
	 * 	@param message		{string}
	 * 	@param roomItem		{ChatRoomEntityItem}
	 * 	@param pinCode		{string}
	 * 	@returns {Promise<string>}
	 *	@private
	 */
	public encryptMessage(
		message : string,
		roomItem : ChatRoomEntityItem,
		pinCode : string
	) : Promise<string>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( message ) || _.isEmpty( message ) )
				{
					return reject( `${ this.constructor.name } :: invalid message` );
				}
				if ( ! roomItem )
				{
					return reject( `${ this.constructor.name } :: invalid roomItem` );
				}
				if ( ! roomItem )
				{
					return reject( `${ this.constructor.name } :: invalid roomItem` );
				}
				if ( ChatType.GROUP !== roomItem.chatType )
				{
					return reject( `${ this.constructor.name } :: invalid .chatType, not GROUP` );
				}

				const encryptionKey : string = await this.chatRoomStorageService.decryptPassword( roomItem.password, pinCode );
				const encrypted : string = new AesCrypto().encrypt( message, encryptionKey );

				//	...
				resolve( encrypted );
			}
			catch ( err )
			{
				reject( err );
			}
		})
	}

	/**
	 * 	@param encrypted		{string}
	 * 	@param roomItem		{ChatRoomEntityItem}
	 * 	@param pinCode		{string}
	 * 	@returns {Promise<string>}
	 *	@private
	 */
	public decryptMessage(
		encrypted : string,
		roomItem : ChatRoomEntityItem,
		pinCode : string
	) : Promise<string>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( encrypted ) || _.isEmpty( encrypted ) )
				{
					return reject( `${ this.constructor.name } :: invalid encrypted` );
				}
				if ( ! roomItem )
				{
					return reject( `${ this.constructor.name } :: invalid roomItem` );
				}
				if ( ! roomItem )
				{
					return reject( `${ this.constructor.name } :: invalid roomItem` );
				}
				if ( ChatType.GROUP !== roomItem.chatType )
				{
					return reject( `${ this.constructor.name } :: invalid .chatType, not GROUP` );
				}

				const encryptionKey : string = await this.chatRoomStorageService.decryptPassword( roomItem.password, pinCode );
				const message : string = new AesCrypto().decrypt( encrypted, encryptionKey );

				//	...
				resolve( message );
			}
			catch ( err )
			{
				reject( err );
			}
		})
	}
}