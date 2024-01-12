
import _ from "lodash";
import { EtherWallet } from "debeem-id";
import { ChatType, MessageType, SendMessageRequest } from "../models/messages/SendMessageRequest";
import { Constants} from "../constants/Constants";
import { VaChatRoomEntityItem } from "./VaChatRoomEntityItem";

/**
 * 	@class
 */
export class VaSendMessageRequest
{
	/**
	 *	@param hash	{any}
	 *	@returns {string | null}
	 */
	static isValidHash( hash : any ) : string | null
	{
		if ( ! _.isString( hash ) )
		{
			return `invalid .hash`;
		}
		if ( Constants.maxLengthHash !== hash.length )
		{
			return `invalid .hash, the length is not equal to ${ Constants.maxLengthHash }`;
		}

		return null;
	}

	/**
	 *	@param sig	{any}
	 *	@returns {string | null}
	 */
	static isValidSig( sig : any ) : string | null
	{
		if ( ! _.isString( sig ) )
		{
			return `invalid .sig`;
		}
		if ( Constants.maxLengthSig !== sig.length )
		{
			return `invalid .sig, the length is not equal to ${ Constants.maxLengthSig }`;
		}

		return null;
	}

	/**
	 *	@param messageType	{any}
	 *	@return {string | null}
	 */
	static isValidMessageType( messageType : any ) : string | null
	{
		if ( ! _.isNumber( messageType ) ||
			! ( messageType in MessageType ) )
		{
			return `isValidMessageType :: invalid .messageType`;
		}

		return null;
	}

	/**
	 *	@param sendMessageRequest	{SendMessageRequest}
	 *	@returns {string | null}
	 */
	static validateSendMessageRequest( sendMessageRequest : SendMessageRequest ) : string | null
	{
		if ( ! _.isObject( sendMessageRequest ) ||
			! _.has( sendMessageRequest, 'payload' ) ||
			! _.isObject( sendMessageRequest.payload ) )
		{
			return `invalid sendMessageRequest`;
		}
		if ( ! ( sendMessageRequest.payload.chatType in ChatType ) )
		{
			return `invalid .payload.chatType`;
		}

		if ( ! EtherWallet.isValidAddress( sendMessageRequest.payload.wallet ) )
		{
			return `invalid .payload.wallet`;
		}

		if ( _.isString( sendMessageRequest.payload.fromName ) &&
			sendMessageRequest.payload.fromName.length > Constants.maxLengthUserName )
		{
			return `length of .payload.fromName exceeds limit ${ Constants.maxLengthUserName }`;
		}

		if ( _.isString( sendMessageRequest.payload.fromAvatar ) &&
			sendMessageRequest.payload.fromAvatar.length > Constants.maxLengthUserAvatar )
		{
			return `length of .payload.fromAvatar exceeds limit ${ Constants.maxLengthUserAvatar }`;
		}

		const errorRoom : string | null = VaChatRoomEntityItem.isValidRoomId( sendMessageRequest.payload.roomId );
		if ( null !== errorRoom )
		{
			return errorRoom;
		}

		if ( ! _.isString( sendMessageRequest.payload.body ) )
		{
			return `invalid .payload.body`;
		}
		if ( sendMessageRequest.payload.body.length > Constants.maxLengthBody )
		{
			return `length of .payload.body exceeds limit ${ Constants.maxLengthBody }`;
		}

		const errorTimestamp : string | null = VaChatRoomEntityItem.isValidTimestamp( sendMessageRequest.payload.timestamp );
		if ( null !== errorTimestamp )
		{
			return errorTimestamp;
		}

		const errorHash : string | null = this.isValidHash( sendMessageRequest.payload.hash );
		if ( null !== errorHash )
		{
			return errorHash;
		}

		const errorSig : string | null = this.isValidSig( sendMessageRequest.payload.sig );
		if ( null !== errorSig )
		{
			return errorSig;
		}

		return null;
	}
}