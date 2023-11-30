
import { IDBPDatabase } from "idb/build/entry";
import { openDB, StoreNames } from "idb";
import { StorageEntity } from "../entities/StorageEntity";
import { PageUtil, TypeUtil } from "debeem-utils";
import { AesCrypto } from "debeem-cipher";
import { ConditionCallback, HandlerCallback, IStorageService } from "./IStorageService";
import { PaginationOptions } from "../models/PaginationOptions";
import { TestUtil } from "debeem-utils";
import _ from "lodash";


/**
 * 	abstract class AbstractStorageService
 */
export abstract class AbstractStorageService<T> implements IStorageService
{
	protected db ! : IDBPDatabase<StorageEntity> | any;
	protected databaseName ! : string;
	protected version ! : number;
	protected storeName ! : StoreNames<StorageEntity> | any;
	protected autoIncrementKey : boolean = false;
	protected password : string = '';	//	pin code
	protected storageCrypto : AesCrypto = new AesCrypto( `debeem_chat_` );


	protected constructor( databaseName : string, password : string = '' )
	{
		this.databaseName = databaseName;
		this.version = 1;
		this.storeName = 'root';
		this.autoIncrementKey = false;
		this.password = password;
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
				this.db = await openDB<StorageEntity>
				(
					this.databaseName,
					this.version,
					{
						upgrade( db )
						{
							if ( _this.autoIncrementKey )
							{
								db.createObjectStore( _this.storeName, {
									//	The 'id' property of the object will be the key.
									keyPath: 'id',
									//	if it isn't explicitly set, create a value by auto incrementing.
									autoIncrement: true,
								} );
							}
							else
							{
								db.createObjectStore( _this.storeName );
							}
						},
					} );
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
		} );
	}

	/**
	 *	@param item	{any}
	 *	@returns { string | null }
	 */
	isValidItem( item : any ) : string | null
	{
		return `unknown error`;
	}


	/**
	 *	@param value	{ * }
	 *	@returns Promise<string>
	 */
	public async encodeItem( value : T ) : Promise<string>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( null !== this.isValidItem( value ) )
				{
					return reject( `invalid value for :encodeItem` );
				}

				const encrypted : string = await this.storageCrypto.encryptFromObject( value, this.password );
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
	public async decodeItem( encoded : string ) : Promise< T | null >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( encoded ) || _.isEmpty( encoded ) )
				{
					return reject( `invalid value for :decodeItem` );
				}

				const value : T | undefined = await this.storageCrypto.decryptToObject( encoded, this.password );
				return resolve( value ? value : null );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}

	/**
	 * 	delete all items
	 * 	@returns {Promise<boolean>}
	 */
	public async clear() : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				await this.init();
				await this.db.clear( 'root' );
				resolve( true );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}
