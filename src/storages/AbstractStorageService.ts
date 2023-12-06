
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

	/**
	 *	@param key	- wallet address is the key
	 *	@returns {Promise<boolean>}
	 */
	public async delete( key : string ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( key ) )
				{
					return reject( `invalid key for .delete` );
				}

				await this.init();
				await this.db.delete( 'root', key );
				resolve( true );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	get item by key
	 *	@param key
	 *	@returns {Promise<* | null>}
	 */
	public async get( key : string ) : Promise<T | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( key ) )
				{
					return reject( `invalid key for .get` );
				}

				await this.init();
				await TestUtil.sleep( 1 );

				const encrypted : string | undefined = await this.db.get( 'root', key );
				if ( encrypted )
				{
					const value : T | null = await this.decodeItem( encrypted );
					return resolve( value ? value : null );
				}

				//	...
				resolve( null );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 *	Put an item into the database, and will replace the item with the same key.
	 *	@param key
	 *	@param value
	 *	@returns {Promise<boolean>}
	 */
	public async put( key : string, value : T ) : Promise<boolean>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( null !== this.isValidItem( value ) )
				{
					return reject( `invalid value for :put` );
				}
				if ( ! TypeUtil.isNotEmptyString( key ) )
				{
					return reject( `invalid key for :put` );
				}

				//	...
				await this.init();
				const encrypted : string = await this.encodeItem( value );
				await this.db.put( this.storeName, encrypted, key );
				resolve( true );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	get the first item
	 * 	@returns {Promise<* | null>}
	 */
	public async getFirst() : Promise<T | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const firstItems : Array<T | null> | null = await this.getAll( undefined, 1 );
				if ( Array.isArray( firstItems ) && 1 === firstItems.length )
				{
					return resolve( firstItems[ 0 ] );
				}

				//	...
				resolve( null );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	get all of keys
	 *	@param query
	 *	@param maxCount
	 *	@returns {Promise<Array<string> | null>}
	 */
	public async getAllKeys( query? : string, maxCount? : number ) : Promise<Array<string> | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				await this.init();
				const value : Array<string> | null = await this.db.getAllKeys( 'root', query, maxCount );
				resolve( value ? value : null );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	query all items
	 *	@param query
	 *	@param maxCount
	 *	@returns {Promise<Array< * | null > | null>}
	 */
	public async getAll( query? : string, maxCount? : number ) : Promise<Array<T | null> | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				await this.init();
				const list : Array<string> | null = await this.db.getAll( 'root', query, maxCount );
				if ( Array.isArray( list ) && list.length > 0 )
				{
					let objectList : Array<T | null> = [];
					for ( const encrypted of list )
					{
						let object : T | null = null;
						try
						{
							object = await this.decodeItem( encrypted );
						}
						catch ( err )
						{
							console.error( err );
						}

						//	...
						objectList.push( object );
					}

					//	...
					return resolve( objectList );
				}

				//	...
				resolve( null );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	query items
	 *	@param condition	{ConditionCallback}
	 *	@param pageOptions	{PaginationOptions}
	 *	@returns {Promise<Array< * | null > | null>}
	 */
	public async query( condition ?: ConditionCallback, pageOptions ?: PaginationOptions ) : Promise<Array<T | null> | null>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				await this.init();

				const pageNo : number = PageUtil.getSafePageNo( pageOptions?.pageNo );
				const pageSize : number = PageUtil.getSafePageSize( pageOptions?.pageSize );

				let objectList : Array<T | null> = [];
				const tx = this.db.transaction( this.storeName );
				let cursor = await tx.store.openCursor();
				let index = 0;
				while ( cursor )
				{
					//console.log( cursor.key, cursor.value );

					//	decrypt
					let cursorObject : T | null = null;
					try
					{
						const encrypted : string = cursor.value;
						cursorObject = await this.decodeItem( encrypted );
					}
					catch ( err )
					{
						console.error( err );
					}

					//	...
					let well : boolean = true;
					if ( _.isFunction( condition ) )
					{
						//	do not check whether cursorObject equal to null or undefined
						//	just passes it to user
						well = condition( cursor.key, cursorObject, index );
					}
					if ( well )
					{
						if ( PageUtil.pageCondition( index, pageNo, pageSize ) )
						{
							objectList.push( cursorObject );
						}

						//	...
						index++;
					}

					if ( objectList.length >= pageSize )
					{
						break;
					}

					//	next
					cursor = await cursor.continue();
				}
				await tx.done;

				//	...
				resolve( objectList );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 *	@param condition	{ConditionCallback}
	 *	@param updateHandler	{HandlerCallback}
	 *	@returns {Promise<number>}
	 */
	update( condition : ConditionCallback, updateHandler : HandlerCallback ) : Promise<number>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isFunction( condition ) )
				{
					return reject( `invalid condition` );
				}
				if ( ! _.isFunction( updateHandler ) )
				{
					return reject( `invalid handler` );
				}

				await this.init();

				const tx = this.db.transaction( this.storeName );
				let cursor = await tx.store.openCursor();
				let index = 0;
				let updated = 0;
				while ( cursor )
				{
					//	decode/decrypt
					let cursorObject : T | null = null;
					try
					{
						const encrypted = cursor.value;
						cursorObject = await this.decodeItem( encrypted );
					}
					catch ( err )
					{
						console.error( err );
					}

					//	do not check whether cursorObject equal to null or undefined
					//	just passes it to user
					if ( condition( cursor.key, cursorObject, index ) )
					{
						updateHandler( cursor.key, cursorObject, index );
						if ( cursorObject )
						{
							//cursor.update( await this.encodeItem( cursorObject ) );
							if ( await this.put( cursor.key, cursorObject ) )
							{
								updated ++;
							}
						}

						//	...
						index++;
					}

					//	next
					cursor = await cursor.continue();
				}
				await tx.done;

				//	...
				resolve( updated );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	Retrieves the number of records matching the given condition
	 *	@param condition	{ConditionCallback}
	 *	@returns {Promise<number>}
	 */
	public async count( condition ?: ConditionCallback ) : Promise<number>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				await this.init();
				let count : number = 0;
				if ( _.isFunction( condition ) )
				{
					const tx = this.db.transaction( this.storeName );
					let cursor = await tx.store.openCursor();
					let index = 0;
					while ( cursor )
					{
						//console.log( cursor.key, cursor.value );

						//	decrypt
						let cursorObject : T | null = null;
						try
						{
							const encrypted = cursor.value;
							cursorObject = await this.decodeItem( encrypted );
						}
						catch ( err )
						{
							console.error( err );
						}

						//	do not check whether cursorObject equal to null or undefined
						//	just passes it to user
						if ( condition( cursor.key, cursorObject, index ) )
						{
							count ++;
						}

						//	next
						cursor = await cursor.continue();
					}
					await tx.done;
				}
				else
				{
					count = await this.db.count( this.storeName );
				}

				//	...
				resolve( count );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}