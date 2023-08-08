
import { ClientRoom } from "./ClientRoom";
import { ChatMessage } from "./models/messages/SendMessageRequest";
import { ChatRoomEntityItem, ChatRoomEntityUnreadItem } from "./entities/ChatRoomEntity";
import _ from "lodash";
import { VaChatRoomEntityItem } from "./validators/VaChatRoomEntityItem";

/**
 * 	@class ClientRoomLatestMessage
 */
export class ClientRoomLatestMessage extends ClientRoom
{
	/**
	 * 	@param wallet	{string}
	 * 	@param roomId	{string}
	 * 	@returns {Promise<ChatMessage | null>}
	 */
	public queryLatestMessage( wallet : string, roomId : string ) : Promise< ChatMessage | null >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const errorWallet : string | null = VaChatRoomEntityItem.isValidWallet( wallet );
				if ( null !== errorWallet )
				{
					return reject( `${ this.constructor.name }.queryLatestMessage :: ${ errorWallet }` )
				}

				const errorRoomId : string | null = VaChatRoomEntityItem.isValidRoomId( roomId );
				if ( null !== errorRoomId )
				{
					return reject( `${ this.constructor.name }.queryLatestMessage :: ${ errorRoomId }` );
				}

				const room : ChatRoomEntityItem | null = await this.queryRoom( wallet, roomId );
				if ( room )
				{
					return resolve( room.latestMessage ? room.latestMessage : null );
				}

				resolve( null );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	@param wallet		{string}
	 * 	@param roomId		{string}
	 * 	@param chatMessage	{ChatMessage}
	 * 	@returns {Promise<boolean>}
	 */
	public updateLatestMessage( wallet : string, roomId : string, chatMessage : ChatMessage ) : Promise< boolean >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const errorWallet : string | null = VaChatRoomEntityItem.isValidWallet( wallet );
				if ( null !== errorWallet )
				{
					return reject( `${ this.constructor.name }.updateLatestMessage :: ${ errorWallet }` )
				}

				const errorRoomId : string | null = VaChatRoomEntityItem.isValidRoomId( roomId );
				if ( null !== errorRoomId )
				{
					return reject( `${ this.constructor.name }.updateLatestMessage :: ${ errorRoomId }` );
				}
				if ( ! chatMessage )
				{
					return reject( `${ this.constructor.name }.updateLatestMessage :: invalid chatMessage` );
				}

				const room : ChatRoomEntityItem | null = await this.queryRoom( wallet, roomId );
				if ( room )
				{
					//	update field
					room.latestMessage = chatMessage;

					//	try to save
					const key : string | null = this.chatRoomStorageService.getKeyByItem( room );
					if ( ! _.isString( key ) || _.isEmpty( key ) )
					{
						return reject( `${ this.constructor.name }.updateLatestMessage :: failed to get storage key` );
					}

					return resolve( await this.chatRoomStorageService.put( key, room ) );
				}

				resolve( false );
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
	 * 	@returns {Promise<ChatRoomEntityUnreadItem>}
	 */
	public queryUnread( wallet : string, roomId : string ) : Promise< ChatRoomEntityUnreadItem | null >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const errorWallet : string | null = VaChatRoomEntityItem.isValidWallet( wallet );
				if ( null !== errorWallet )
				{
					return reject( `${ this.constructor.name }.queryUnread :: ${ errorWallet }` )
				}

				const errorRoomId : string | null = VaChatRoomEntityItem.isValidRoomId( roomId );
				if ( null !== errorRoomId )
				{
					return reject( `${ this.constructor.name }.queryUnread :: ${ errorRoomId }` );
				}

				const room : ChatRoomEntityItem | null = await this.queryRoom( wallet, roomId );
				resolve( room?.unread ? room?.unread : null );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	@param wallet		{string}
	 * 	@param roomId		{string}
	 * 	@param unread		{ChatRoomEntityUnreadItem}
	 * 	@returns {Promise<boolean>}
	 */
	public updateUnread( wallet : string, roomId : string, unread : ChatRoomEntityUnreadItem ) : Promise< boolean >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const errorWallet : string | null = VaChatRoomEntityItem.isValidWallet( wallet );
				if ( null !== errorWallet )
				{
					return reject( `${ this.constructor.name }.updateUnread :: ${ errorWallet }` )
				}

				const errorRoomId : string | null = VaChatRoomEntityItem.isValidRoomId( roomId );
				if ( null !== errorRoomId )
				{
					return reject( `${ this.constructor.name }.updateUnread :: ${ errorRoomId }` );
				}

				const errorUnread : string | null = VaChatRoomEntityItem.validateChatRoomEntityUnreadItem( unread );
				if ( null !== errorUnread )
				{
					return reject( `${ this.constructor.name }.updateUnread :: invalid unread` );
				}

				const room : ChatRoomEntityItem | null = await this.queryRoom( wallet, roomId );
				if ( room )
				{
					//	update field
					room.unread = unread;

					//	try to save
					const key : string | null = this.chatRoomStorageService.getKeyByItem( room );
					if ( ! _.isString( key ) || _.isEmpty( key ) )
					{
						return reject( `${ this.constructor.name }.updateUnread :: failed to get storage key` );
					}

					return resolve( await this.chatRoomStorageService.put( key, room ) );
				}

				resolve( false );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}
}