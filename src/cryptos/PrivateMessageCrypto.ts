
import { ChatRoomEntityItem } from "../entities/ChatRoomEntity";
import { ChatType } from "../models/messages/SendMessageRequest";
import _ from "lodash";
import { ethers, isAddress } from "ethers";
import { AesCrypto } from "debeem-cipher";
import { isHexString } from "ethers";

/**
 * 	@class
 */
export class PrivateMessageCrypto
{
	/**
	 * 	@param message			{string}
	 * 	@param roomItem			{ChatRoomEntityItem}
	 * 	@param fromWallet		{string}
	 * 	@param fromPrivateKey		{string}
	 * 	@returns {Promise<string>}
	 */
	public encryptMessage(
		message : string,
		roomItem : ChatRoomEntityItem,
		fromWallet : string,
		fromPrivateKey : string
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
				if ( ! isAddress( fromWallet ) )
				{
					return reject( `${ this.constructor.name } :: invalid fromWallet` );
				}
				if ( ! isHexString( fromPrivateKey, 32 ) )
				{
					return reject( `${ this.constructor.name } :: invalid fromPrivateKey` );
				}
				if ( ! roomItem )
				{
					return reject( `${ this.constructor.name } :: invalid roomItem` );
				}
				if ( ChatType.PRIVATE !== roomItem.chatType )
				{
					return reject( `${ this.constructor.name } :: invalid .chatType, not PRIVATE` );
				}
				if ( ! _.isObject( roomItem.members ) ||
					! Array.isArray( Object.keys( roomItem.members ) ) ||
					2 !== Object.keys( roomItem.members ).length )
				{
					return reject( `${ this.constructor.name } :: invalid .members, must be two members` );
				}

				console.log( `${ this.constructor.name } :: roomItem :`, roomItem );
				console.log( `${ this.constructor.name } :: fromWallet :`, fromWallet );
				console.log( `${ this.constructor.name } :: fromPrivateKey :`, fromPrivateKey );

				let toPublicKey : string | undefined = '';
				for ( const memberWallet in roomItem.members )
				{
					if ( memberWallet.trim().toLowerCase() !== fromWallet.trim().toLowerCase() )
					{
						toPublicKey = roomItem.members[ memberWallet ].publicKey;
						break;
					}
				}
				if ( ! _.isString( toPublicKey ) || _.isEmpty( toPublicKey ) )
				{
					return reject( `${ this.constructor.name } :: recipient's publicKey was not found` );
				}

				//	ECDH
				//	a key secure key exchange algorithm
				const signingKey = new ethers.SigningKey( fromPrivateKey );
				const sharedSecret = signingKey.computeSharedSecret( toPublicKey );
				const encrypted : string = new AesCrypto().encrypt( message, sharedSecret );
				console.log( `${ this.constructor.name } :: encryptMessage : fromPrivateKey: `, fromPrivateKey );
				console.log( `${ this.constructor.name } :: encryptMessage : toPublicKey: `, toPublicKey );
				console.log( `${ this.constructor.name } :: encryptMessage : sharedSecret: `, sharedSecret );

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
	 * 	@param roomItem			{ChatRoomEntityItem}
	 * 	@param fromWallet		{string}
	 * 	@param fromPrivateKey		{string}
	 * 	@returns {Promise<string>}
	 */
	public decryptMessage(
		encrypted : string,
		roomItem : ChatRoomEntityItem,
		fromWallet : string,
		fromPrivateKey : string
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
				if ( ! isAddress( fromWallet ) )
				{
					return reject( `${ this.constructor.name } :: invalid fromWallet` );
				}
				if ( ! isHexString( fromPrivateKey, 32 ) )
				{
					return reject( `${ this.constructor.name } :: invalid fromPrivateKey` );
				}
				if ( ! roomItem )
				{
					return reject( `${ this.constructor.name } :: invalid roomItem` );
				}
				if ( ChatType.PRIVATE !== roomItem.chatType )
				{
					return reject( `${ this.constructor.name } :: invalid .chatType, not PRIVATE` );
				}
				if ( ! _.isObject( roomItem.members ) ||
					! Array.isArray( Object.keys( roomItem.members ) ) ||
					2 !== Object.keys( roomItem.members ).length )
				{
					return reject( `${ this.constructor.name } :: invalid .members, must be two members` );
				}

				let toPublicKey : string | undefined = '';
				for ( const memberWallet in roomItem.members )
				{
					if ( memberWallet.trim().toLowerCase() !== fromWallet.trim().toLowerCase() )
					{
						toPublicKey = roomItem.members[ memberWallet ].publicKey;
						break;
					}
				}
				if ( ! _.isString( toPublicKey ) || _.isEmpty( toPublicKey ) )
				{
					return reject( `${ this.constructor.name } :: recipient's publicKey was not found` );
				}

				//	ECDH
				//	a key secure key exchange algorithm
				const signingKey = new ethers.SigningKey( fromPrivateKey );
				const sharedSecret = signingKey.computeSharedSecret( toPublicKey );
				const message : string = new AesCrypto().decrypt( encrypted, sharedSecret );

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