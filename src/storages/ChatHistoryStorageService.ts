
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