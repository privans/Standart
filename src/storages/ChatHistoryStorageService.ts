
import { VaChatRoomMember } from "../validators/VaChatRoomMember";

if ( typeof process !== 'undefined' && process.env )
{
	//import "fake-indexeddb/auto";
	require('fake-indexeddb/auto');
}

import { AbstractStorageService } from "./AbstractStorageService";
import { IStorageService } from "./IStorageService";
import { VaChatRoomEntityItem } from "../validators/VaChatRoomEntityItem";
import { ChatHistoryEntity, ChatHistoryEntityItem } from "../entities/ChatHistoryEntity";
import { VaChatHistoryEntityItem } from "../validators/VaChatHistoryEntityItem";
import { TypeUtil } from "debeem-utils";
import { openDB, StoreNames } from "idb";
import { IDBPDatabase } from "idb/build/entry";
import _ from "lodash";


/**
 * 	@class
 */
export class ChatHistoryStorageService extends AbstractStorageService<ChatHistoryEntityItem> implements IStorageService
{
	protected db !: IDBPDatabase<ChatHistoryEntity>;
	protected storeName !: StoreNames<ChatHistoryEntity>;

	constructor( password : string = '' )
	{
		super( 'debeem_chat_history_entity', password );
		this.autoIncrementKey = true;
		this.storeName = 'root';
	}

	protected async init()
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( this.db )
				{
					return resolve( this.db );
				}
				if ( ! TypeUtil.isNotEmptyString( this.databaseName ) )
				{
					return reject( `invalid databaseName` );
				}

				const _this = this;
				this.db = await openDB<ChatHistoryEntity>
				(
					this.databaseName,
					this.version,
					{
						upgrade( db )
						{
							db.createObjectStore( _this.storeName );
							//const store = db.createObjectStore( _this.storeName );
							//store.createIndex( 'by-roomId', 'roomId' );
						},
					});
				if ( ! this.db )
				{
					return reject( `failed to init database` );
				}

				resolve( this.db );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 *	@param item	{any}
	 *	@returns {string | null}
	 */
	public isValidItem( item : any ) : string | null
	{
		if ( ! item )
		{
			return `null item`;
		}

		const errorUUID : string | null = VaChatHistoryEntityItem.isValidUUID( item.uuid );
		if ( null !== errorUUID )
		{
			return errorUUID;
		}

		const errorRoomId : string | null = VaChatRoomEntityItem.isValidRoomId( item.roomId );
		if ( null !== errorRoomId )
		{
			return errorRoomId;
		}

		const errorUserName : string | null = VaChatRoomMember.isValidUserName( item.userName );
		if ( null !== errorUserName )
		{
			return errorUserName;
		}

		if ( undefined !== item.userAvatar )
		{
			const errorUserAvatar : string | null = VaChatRoomMember.isValidUserAvatar( item.userAvatar );
			if ( null !== errorUserAvatar )
			{
				return errorUserName;
			}
		}

		const errorBody : string | null = VaChatHistoryEntityItem.isValidBody( item.body );
		if ( null !== errorBody )
		{
			return errorBody;
		}

		const errorTimestamp : string | null = VaChatRoomEntityItem.isValidTimestamp( item.timestamp );
		if ( null !== errorTimestamp )
		{
			return errorTimestamp;
		}

		return null;
	}

	/**
	 * 	get a storage key
	 *	@param value	{ChatHistoryEntityItem}
	 *	@returns {string | null}
	 */
	public getKeyByItem( value : ChatHistoryEntityItem ) : string | null
	{
		const errorItem = this.isValidItem( value );
		if ( null === errorItem )
		{
			return String( value.uuid ).trim().toLowerCase();
		}

		return null;
	}

	/**
	 *	@param value	{ * }
	 *	@returns Promise<string>
	 */
	public async encodeItem( value : ChatHistoryEntityItem ) : Promise<string>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( null !== this.isValidItem( value ) )
				{
					return reject( `invalid value for :encodeItem` );
				}

				const encrypted : string = JSON.stringify( value );
				resolve( encrypted );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 *	@param encoded	{string}	- encoded/encrypted string
	 *	@returns {Promise< * | null >}
	 */
	public async decodeItem( encoded : string ) : Promise< ChatHistoryEntityItem | null >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( encoded ) || _.isEmpty( encoded ) )
				{
					return reject( `invalid value for :decodeItem` );
				}

				const value : ChatHistoryEntityItem | undefined = JSON.parse( encoded );
				return resolve( value ? value : null );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}


	//
	// /**
	//  * 	get item by key
	//  *	@param key
	//  *	@returns {Promise<* | null>}
	//  */
	// public async get( key : string ) : Promise<ChatHistoryEntityItem | null>
	// {
	// 	return new Promise( async ( resolve, reject ) =>
	// 	{
	// 		try
	// 		{
	// 			if ( ! TypeUtil.isNotEmptyString( key ) )
	// 			{
	// 				return reject( `invalid key for .get` );
	// 			}
	//
	// 			await this.init();
	// 			await TestUtil.sleep( 1 );
	//
	// 			const stringifyValue : string | undefined = await this.db.get( 'root', key );
	// 			if ( stringifyValue )
	// 			{
	// 				const value : ChatHistoryEntityItem | null = await this.decodeItem( stringifyValue );
	// 				return resolve( value ? value : null );
	// 			}
	//
	// 			//	...
	// 			resolve( null );
	// 		}
	// 		catch ( err )
	// 		{
	// 			reject( err );
	// 		}
	// 	});
	// }
	//
	// /**
	//  * 	Put an item into the database, and will replace the item with the same key.
	//  *	@param key
	//  *	@param value
	//  *	@returns {Promise<boolean>}
	//  */
	// public async put( key: string, value : ChatHistoryEntityItem ) : Promise<boolean>
	// {
	// 	return new Promise( async ( resolve, reject ) =>
	// 	{
	// 		try
	// 		{
	// 			if ( null !== this.isValidItem( value ) )
	// 			{
	// 				return reject( `invalid value for .put` );
	// 			}
	// 			if ( ! TypeUtil.isNotEmptyString( key ) )
	// 			{
	// 				return reject( `invalid key for .put` );
	// 			}
	//
	// 			if ( ! value.timestamp )
	// 			{
	// 				const ts = parseInt( key );
	// 				value.timestamp = ( _.isNumber( ts ) && ts > 0 ) ? ts : new Date().getTime();
	// 			}
	//
	// 			//	...
	// 			await this.init();
	// 			const stringifyValue : string = await this.encodeItem( value );
	// 			await this.db.put( 'root', stringifyValue, key );
	// 			resolve( true );
	// 		}
	// 		catch ( err )
	// 		{
	// 			reject( err );
	// 		}
	// 	});
	// }
	//
	// /**
	//  * 	query all items
	//  *	@param query
	//  *	@param maxCount
	//  *	@returns {Promise<Array< ChatHistoryEntityItem | null > | null>}
	//  */
	// public async getAll( query? : string, maxCount? : number ) : Promise<Array< ChatHistoryEntityItem | null > | null>
	// {
	// 	return new Promise( async ( resolve, reject ) =>
	// 	{
	// 		try
	// 		{
	// 			await this.init();
	// 			const list : Array<string> | Array<ChatHistoryEntityItem> | null = await this.db.getAll( 'root', query, maxCount );
	// 			if ( Array.isArray( list ) && list.length > 0 )
	// 			{
	// 				let objectList : Array< ChatHistoryEntityItem | null > = [];
	// 				for ( let stringValue of list )
	// 				{
	// 					const object : ChatHistoryEntityItem | null = await this.decodeItem( stringValue );
	// 					if ( ! _.isObject( object ) )
	// 					{
	// 						continue;
	// 					}
	//
	// 					//	...
	// 					objectList.push( object );
	// 				}
	//
	// 				//	...
	// 				return resolve( objectList );
	// 			}
	//
	// 			//	...
	// 			resolve( null );
	// 		}
	// 		catch ( err )
	// 		{
	// 			reject( err );
	// 		}
	// 	});
	// }
	//
	// /**
	//  * 	query items
	//  *	@param condition	{ConditionCallback}
	//  *	@param pageOptions	{PaginationOptions}
	//  *	@returns {Promise<Array< ChatHistoryEntityItem | null > | null>}
	//  */
	// public async query( condition ?: ConditionCallback, pageOptions ?: PaginationOptions ) : Promise<Array< ChatHistoryEntityItem | null > | null>
	// {
	// 	return new Promise( async ( resolve, reject ) =>
	// 	{
	// 		try
	// 		{
	// 			await this.init();
	//
	// 			const pageNo : number = PageUtil.getSafePageNo( pageOptions?.pageNo );
	// 			const pageSize : number = PageUtil.getSafePageSize( pageOptions?.pageSize );
	//
	// 			let objectList : Array< ChatHistoryEntityItem | null > = [];
	// 			const tx = this.db.transaction( this.storeName );
	// 			let cursor = await tx.store.openCursor();
	// 			let index = 0;
	// 			while ( cursor )
	// 			{
	// 				//console.log( cursor.key, cursor.value );
	// 				let cursorObject : ChatHistoryEntityItem | null = await this.decodeItem( String( cursor.value ) );
	// 				let well : boolean = true;
	// 				if ( _.isFunction( condition ) )
	// 				{
	// 					well = condition( cursor.key, cursorObject, index );
	// 				}
	// 				if ( well )
	// 				{
	// 					if ( PageUtil.pageCondition( index, pageNo, pageSize ) )
	// 					{
	// 						objectList.push( cursorObject );
	// 					}
	//
	// 					//	...
	// 					index ++;
	// 				}
	//
	// 				if ( objectList.length >= pageSize )
	// 				{
	// 					break;
	// 				}
	//
	// 				//	next
	// 				cursor = await cursor.continue();
	// 			}
	// 			await tx.done;
	//
	// 			//	...
	// 			resolve( objectList );
	// 		}
	// 		catch ( err )
	// 		{
	// 			reject( err );
	// 		}
	// 	});
	// }
	//
	//
	// /**
	//  *	@param condition	{ConditionCallback}
	//  *	@param handler		{HandlerCallback}
	//  *	@returns {Promise<number>}
	//  */
	// update( condition : ConditionCallback, handler : HandlerCallback ) : Promise<number>
	// {
	// 	return new Promise( async ( resolve, reject ) =>
	// 	{
	// 		try
	// 		{
	// 			if ( ! _.isFunction( condition ) )
	// 			{
	// 				return reject( `invalid condition` );
	// 			}
	// 			if ( ! _.isFunction( handler ) )
	// 			{
	// 				return reject( `invalid handler` );
	// 			}
	//
	// 			await this.init();
	//
	// 			const tx = this.db.transaction( this.storeName );
	// 			let cursor = await tx.store.openCursor();
	// 			let index = 0;
	// 			let updated = 0;
	// 			while ( cursor )
	// 			{
	// 				let cursorObject : ChatHistoryEntityItem | null = await this.decodeItem( String( cursor.value ) );
	//
	// 				//	do not check whether cursorObject equal to null or undefined
	// 				//	just passes it to user
	// 				if ( condition( cursor.key, cursorObject, index ) )
	// 				{
	// 					handler( cursor.key, cursorObject, index );
	// 					if ( cursorObject )
	// 					{
	// 						if ( await this.put( cursor.key, cursorObject ) )
	// 						{
	// 							updated ++;
	// 						}
	// 					}
	//
	// 					//	...
	// 					index++;
	// 				}
	//
	// 				//	next
	// 				cursor = await cursor.continue();
	// 			}
	// 			await tx.done;
	//
	// 			//	...
	// 			resolve( updated );
	// 		}
	// 		catch ( err )
	// 		{
	// 			reject( err );
	// 		}
	// 	} );
	// }
}