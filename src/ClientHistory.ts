
import _ from "lodash";
import { VaChatRoomEntityItem } from "./validators/VaChatRoomEntityItem";
import { ChatHistoryStorageService } from "./storages/ChatHistoryStorageService";
import { ConditionCallback } from "./storages/IStorageService";
import { PaginationOptions } from "./models/PaginationOptions";
import { ChatHistoryEntityItem } from "./entities/ChatHistoryEntity";


/**
 * 	@class
 */
export class ClientHistory
{
	chatHistoryStorageService ! : ChatHistoryStorageService;

	constructor()
	{
		this.chatHistoryStorageService = new ChatHistoryStorageService( `` );
	}

	/**
	 *	@param roomId		{string}
	 *	@param pageOptions	{PaginationOptions}
	 *	@returns {Promise<Array< ChatHistoryEntityItem | null > | null>}
	 */
	query( roomId : string, pageOptions ?: PaginationOptions ) : Promise<Array< ChatHistoryEntityItem | null > | null>
	{
		return new Promise( async ( resolve, reject) =>
		{
			try
			{
				if ( ! VaChatRoomEntityItem.isValidRoomId( roomId ) )
				{
					return reject( `invalid roomId` );
				}

				//	...
				const list : Array< ChatHistoryEntityItem | null > | null =
					await this.chatHistoryStorageService.query( ( _key : string, item : any, _index : number ) : boolean =>
				{
					return item && item.roomId === roomId;

				}, pageOptions );

				//	...
				resolve( list );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 *	@param roomId	{string}
	 *	@returns {Promise<number>}
	 */
	countUnread( roomId : string ) : Promise<number>
	{
		return new Promise( async ( resolve, reject) =>
		{
			try
			{
				if ( ! VaChatRoomEntityItem.isValidRoomId( roomId ) )
				{
					return reject( `invalid roomId` );
				}

				//	...
				const count : number =
					await this.chatHistoryStorageService.count( ( _key : string, item : any, _index : number ) : boolean =>
					{
						return item && ( ! item.read );
					} );

				//	...
				resolve( count );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 *	@param roomId		{string}
	 *	@param condition	{ConditionCallback}
	 *	@returns {Promise<number>}
	 */
	markAsRead( roomId : string, condition ?: ConditionCallback ) : Promise<number>
	{
		return new Promise( async ( resolve, reject) =>
		{
			try
			{
				if ( ! VaChatRoomEntityItem.isValidRoomId( roomId ) )
				{
					return reject( `invalid roomId` );
				}

				//	...
				const count : number =
					await this.chatHistoryStorageService.update( ( key : string, item : any, index : number ) : boolean =>
					{
						if ( _.isFunction( condition ) )
						{
							return condition( key, item, index );
						}
						return item && ( ! item.read );

					}, ( _key : string, item : any, _index : number ) : boolean =>
					{
						if ( item )
						{
							item.read = true;
						}
						return true;
					} );

				//	...
				resolve( count );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}
}