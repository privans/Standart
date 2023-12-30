
import _ from "lodash";
import { CreateChatRoom } from "../models/rooms/CreateChatRoom";
import { ChatType } from "../models/messages/SendMessageRequest";
import { VaChatRoomEntityItem } from "./VaChatRoomEntityItem";
import { ChatRoomMember } from "../entities/ChatRoomEntity";
import { RoomUtil } from "../utils/RoomUtil";
import { isHexString } from "ethers";

/**
 * 	@class
 */
export class VaCreateChatRoom
{
	/**
	 *	@param encryptionKey	{any}
	 *	@returns {string | null}
	 */
	static isValidEncryptionKey( encryptionKey : any ) : string | null
	{
		if ( ! _.isString( encryptionKey ) )
		{
			return `invalid .encryptionKey`;
		}
		if ( encryptionKey.length < 8 || encryptionKey.length > 64 )
		{
			return `invalid encryptionKey, must consist of 8-64 characters`;
		}

		return null;
	}

	/**
	 * 	@param pinCode	{any}
	 *	@returns {string | null}
	 */
	static isValidPinCode( pinCode : any ) : string | null
	{
		if ( ! _.isString( pinCode ) )
		{
			return `invalid .pinCode`;
		}
		if ( pinCode.length < 4 || pinCode.length > 16 )
		{
			return `invalid .pinCode, must consist of 4-16 characters`;
		}

		return null;
	}

	/**
	 *	@param createChatRoomOptions	{CreateChatRoom}
	 *	@returns {string | null}
	 */
	static validateCreateChatRoom( createChatRoomOptions : CreateChatRoom ) : string | null
	{
		if ( ! createChatRoomOptions )
		{
			return `invalid createChatRoomOptions`;
		}

		const errorWallet : string | null = VaChatRoomEntityItem.isValidWallet( createChatRoomOptions.wallet );
		if ( null !== errorWallet )
		{
			return errorWallet;
		}

		if ( ! ( createChatRoomOptions.chatType in ChatType ) )
		{
			return `invalid .chatType`;
		}

		const errorRoomName : string | null = VaChatRoomEntityItem.isValidRoomName( createChatRoomOptions.name );
		if ( null !== errorRoomName )
		{
			return errorRoomName;
		}

		if ( _.isString( createChatRoomOptions.encryptionKey ) )
		{
			const errorEncryptionKey : string | null = this.isValidEncryptionKey( createChatRoomOptions.encryptionKey );
			if ( null !== errorEncryptionKey )
			{
				return errorEncryptionKey;
			}
		}

		if ( _.isString( createChatRoomOptions.pinCode ) )
		{
			const errorPinCode : string | null = this.isValidPinCode( createChatRoomOptions.pinCode );
			if ( null !== errorPinCode )
			{
				return errorPinCode;
			}
		}

		if ( _.isString( createChatRoomOptions.roomId ) )
		{
			const errorRoom : string | null = VaChatRoomEntityItem.isValidRoomId( createChatRoomOptions.roomId );
			if ( null !== errorRoom )
			{
				return errorRoom;
			}
		}

		if ( _.isString( createChatRoomOptions.desc ) )
		{
			const errorDesc : string | null = VaChatRoomEntityItem.isValidDesc( createChatRoomOptions.desc );
			if ( null !== errorDesc )
			{
				return errorDesc;
			}
		}

		const errorMembers : string | null = VaChatRoomEntityItem.isValidMembers( createChatRoomOptions.members );
		if ( null !== errorMembers )
		{
			return errorMembers;
		}

		//
		//	for private chat rooms, the owner must provide the public key
		//
		if ( ChatType.PRIVATE === createChatRoomOptions.chatType )
		{
			const owner : ChatRoomMember | null = RoomUtil.matchRoomOwner( createChatRoomOptions.members );
			if ( ! owner )
			{
				return `owner not found`;
			}
			if ( ! isHexString( owner.publicKey, 33 ) )
			{
				return `invalid owner's publicKey`;
			}
		}

		//	...
		return null;
	}
}