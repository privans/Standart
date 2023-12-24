
import { ChatType } from "../models/messages/SendMessageRequest";
import { Wallet } from "ethers";
import { v4 as UUIDv4 } from "uuid";
import { ChatRoomMember, ChatRoomMembers, ChatRoomMemberType } from "../entities/ChatRoomEntity";
import _ from "lodash";
import { VaChatRoomEntityItem } from "../validators/VaChatRoomEntityItem";

export class RoomUtil
{
	/**
	 * 	@returns {string}
	 */
	public static generateRandomRoomId( chatType : ChatType ) : string
	{
		const prefix : string = ( ChatType.PRIVATE === chatType ? 'p' : 'g' );
		return `${ prefix }${ Wallet.createRandom().address.trim().toLowerCase() }`;
	}

	/**
	 * 	@returns {string}
	 */
	public static generateRandomEncryptionKey() : string
	{
		return UUIDv4().toString().replace( `-`, '' );
	}

	/**
	 *	@param members	{ChatRoomMembers}
	 *	@returns {ChatRoomMember | null}
	 */
	public static matchRoomOwner( members : ChatRoomMembers ) : ChatRoomMember | null
	{
		if ( ! _.isObject( members ) )
		{
			return null;
		}

		for ( const memberWallet in members )
		{
			const member = members[ memberWallet ];
			if ( ChatRoomMemberType.OWNER === member.memberType )
			{
				return member;
			}
		}

		return null;
	}

	/**
	 *	@param members	{ChatRoomMembers}
	 *	@param wallet	{string}
	 *	@returns {ChatRoomMember | null}
	 */
	public static matchRoomMemberByWallet( members : ChatRoomMembers, wallet : string ) : ChatRoomMember | null
	{
		if ( ! _.isObject( members ) )
		{
			return null;
		}
		if ( null !== VaChatRoomEntityItem.isValidWallet( wallet ) )
		{
			return null;
		}

		for ( const memberWallet in members )
		{
			if ( 0 === memberWallet.trim().toLowerCase().localeCompare( wallet.trim().toLowerCase() ) )
			{
				return members[ memberWallet ];
			}
		}

		return null;
	}
}