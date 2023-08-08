
import { BaseMessageBuilder } from "./BaseMessageBuilder";
import { ChatMessage, SendMessageRequest } from "../models/messages/SendMessageRequest";
import { isAddress, isHexString } from "ethers";
import _ from "lodash";
import { VaChatRoomEntityItem } from "../validators/VaChatRoomEntityItem";
import { ChatRoomEntityItem } from "../entities/ChatRoomEntity";
import { Web3Digester, Web3Signer } from "debeem-id";
import { GroupMessageCrypto } from "../cryptos/GroupMessageCrypto";

/**
 * 	@class
 */
export class GroupMessageBuilder extends BaseMessageBuilder
{
	/**
	 *	@param privateKey	{string}
	 *	@param chatMessage	{ChatMessage}
	 *	@param pinCode		{string}
	 *	@returns {SendMessageRequest}
	 */
	public buildMessage( privateKey : string, chatMessage : ChatMessage, pinCode : string ) : Promise<SendMessageRequest>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! isHexString( privateKey, 32 ) )
				{
					return reject( `${ this.constructor.name } :: invalid privateKey` );
				}
				if ( ! _.isObject( chatMessage ) )
				{
					return reject( `${ this.constructor.name } :: invalid chatMessage` );
				}
				if ( ! isAddress( chatMessage.wallet ) )
				{
					return reject( `${ this.constructor.name } :: invalid .wallet` );
				}
				if ( null !== VaChatRoomEntityItem.isValidRoomId( chatMessage.roomId ) )
				{
					return reject( `${ this.constructor.name } :: invalid .roomId` );
				}
				if ( ! _.isString( chatMessage.body ) || _.isEmpty( chatMessage.body ) )
				{
					return reject( `${ this.constructor.name } :: invalid .body` );
				}

				//	...
				const roomItem : ChatRoomEntityItem | null = await this.clientRoom.queryRoom( chatMessage.wallet, chatMessage.roomId );
				if ( ! roomItem )
				{
					return reject( `${ this.constructor.name } :: room not found` );
				}

				//	encrypt body
				chatMessage.body = await new GroupMessageCrypto().encryptMessage(
					chatMessage.body,
					roomItem,
					pinCode
				);
				chatMessage.timestamp = new Date().getTime();
				chatMessage.sig = await Web3Signer.signObject( privateKey, chatMessage );
				chatMessage.hash = await Web3Digester.hashObject( chatMessage );
				const sendMessageRequest : SendMessageRequest = {
					payload : chatMessage
				};

				//	...
				resolve( sendMessageRequest );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}
}