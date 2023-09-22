import { ChatMessage, SendMessageRequest } from "../models/messages/SendMessageRequest";
import _ from "lodash";
import { isAddress, isHexString } from "ethers";
import { VaChatRoomEntityItem } from "../validators/VaChatRoomEntityItem";
import { Web3Digester, Web3Signer } from "debeem-id";
import { PrivateMessageCrypto } from "../cryptos/PrivateMessageCrypto";
import { ChatRoomEntityItem } from "../entities/ChatRoomEntity";
import { BaseMessageBuilder } from "./BaseMessageBuilder";


/**
 * 	@class
 */
export class PrivateMessageBuilder extends BaseMessageBuilder
{
	/**
	 *	@param privateKey	{string}
	 *	@param chatMessage	{ChatMessage}
	 *	@returns {SendMessageRequest}
	 */
	public buildMessage( privateKey : string, chatMessage : ChatMessage ) : Promise<SendMessageRequest>
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
				chatMessage.body = await new PrivateMessageCrypto().encryptMessage(
					chatMessage.body,
					room