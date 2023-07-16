
import { ClientRoom } from "./ClientRoom";
import { ChatRoomEntityItem, ChatRoomEntityItemExtension } from "./entities/ChatRoomEntity";
import _ from "lodash";
import { VaChatRoomEntityItem } from "./validators/VaChatRoomEntityItem";

/**
 * 	@class ClientRoomExtensions
 */
export class ClientRoomExtensions extends ClientRoom
{
	/**
	 * 	@param wallet	{string}
	 * 	@param roomId	{string}
	 * 	@param key	{string}
	 * 	@returns {Promise<any>}
	 */
	public queryExtension( wallet : string, roomId : string, key : string ) : Promise< any >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( key ) || _.isEmpty( key ) )
				{
					return reject( `${ this.constructor.name }.queryExtension :: invalid key` );
				}

				const extensionAll : ChatRoomEntityItemExtension | null = await this.queryExtensionAll( wallet, roomId );
				if ( _.isObject( extensionAll ) )
				{
					if ( _.has( extensionAll, key ) )
					{
						return resolve( extensionAll[ key ] );
					}
				}

				resolve( undefined );
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
	 * 	@returns {Promise<ChatRoomEntityItemExtension | null>}
	 */
	public queryExtensionAll( wallet : string, roomId : string ) : Promise< ChatRoomEntityItemExtension | null >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const errorWallet : string | null = VaChatRoomEntityItem.isValidWallet( wallet );
				if ( null !== errorWallet )
				{
					return reject( `${ this.constructor.name }.queryExtensionAll :: ${ errorWallet }` )
				}

				const errorRoomId : string | null = VaChatRoomEntityItem.isValidRoomId( roomId );
				if ( null !== errorRoomId )
				{
					return reject( `${ this.constructor.name }.queryExtensionAll :: ${ errorRoomId }` );
				}

				const room : ChatRoomEntityItem | null = await this.queryRoom( wallet, roomId );
				if ( room )
				{
					return resolve( room.extensions ? room.extensions : null );
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
	 * 	@param extensionKey	{string}
	 * 	@param extensionValue	{any}
	 * 	@returns {Promise<boolean>}
	 */
	public updateExtension( wallet : string, roomId : string, extensionKey : string, extensionValue : any ) : Promise< boolean >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const errorWallet : string | null = VaChatRoomEntityItem.isValidWallet( wallet );
				if ( null !== errorWallet )
				{
					return reject( `${ this.constructor.name }.updateExtension :: ${ errorWallet }` )
				}

				const errorRoomId : string | null = VaChatRoomEntityItem.isValidRoomId( roomId );
				if ( null !== errorRoomId )
				{
					return reject( `${ this.constructor.name }.updateExtension :: ${ errorRoomId }` );
				}
				if ( ! _.isString( extensionKey ) || _.isEmpty( extensionKey ) )
				{
					return reject( `${ this.constructor.name }.updateExtension :: invalid key` );
				}

				const room : ChatRoomEntityItem | null = await this.queryRoom( wallet, roomId );
				if ( null === room )
				{
					return reject( `${ this.constructor.name }.updateExtension :: room not found` );
				}

				//	...
				let extensions : ChatRoomEntityItemExtension = {};
				if ( _.isObject( room.extensions ) )
				{
					extensions = room.extensions;
				}
				extensions[ extensionKey ] = extensionValue;
				return resolve( await this.updateExtensionAll( wallet, roomId, extensions ) );
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
	 * 	@param extensionKey	{string}
	 * 	@returns {Promise<boolean>}
	 */
	public deleteExtension( wallet : string, roomId : string, extensionKey : string ) : Promise< boolean >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const errorWallet : string | null = VaChatRoomEntityItem.isValidWallet( wallet );
				if ( null !== errorWallet )
				{
					return reject( `${ this.constructor.name }.deleteExtension :: ${ errorWallet }` )
				}

				const errorRoomId : string | null = VaChatRoomEntityItem.isValidRoomId( roomId );
				if ( null !== errorRoomId )
				{
					return reject( `${ this.constructor.name }.deleteExtension :: ${ errorRoomId }` );
				}
				if ( ! _.isString( extensionKey ) || _.isEmpty( extensionKey ) )
				{
					return reject( `${ this.constructor.name }.deleteExtension :: invalid key` );
				}

				const room : ChatRoomEntityItem | null = await this.queryRoom( wallet, roomId );
				if ( null === room )
				{
					return reject( `${ this.constructor.name }.deleteExtension :: room not found` );
				}

				//	...
				let extensions : ChatRoomEntityItemExtension = {};
				if ( _.isObject( room.extensions ) )
				{
					extensions = room.extensions;
				}
				if ( _.has( extensions, extensionKey ) )
				{
					delete extensions[ extensionKey ];
				}

				//	...
				return resolve( await this.updateExtensionAll( wallet, roomId, extensions ) );
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
	 * 	@param extensions	{ChatRoomEntityItemExtension}
	 * 	@returns {Promise<boolean>}
	 */
	public updateExtensionAll( wallet : string, roomId : string, extensions : ChatRoomEntityItemExtension ) : Promise< boolean >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const errorWallet : string | null = VaChatRoomEntityItem.isValidWallet( wallet );
				if ( null !== errorWallet )