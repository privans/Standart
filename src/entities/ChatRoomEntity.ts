
import { ChatMessage, ChatType } from "../models/messages/SendMessageRequest";

export enum ChatRoomMemberType
{
	UNKNOWN = 0,
	OWNER = 1,
	MEMBER = 2,
}

export interface ChatRoomMember
{
	memberType : ChatRoomMemberType;

	/**
	 * 	member's wallet address
	 * 	@type {string}
	 * 	@description start with 0x, hex string with 42 characters
	 */
	wallet : string;

	/**
	 *	@type {string}
	 *	@description public key while chatType === ChatType.PRIVATE
	 */
	publicKey ?: string;

	/**