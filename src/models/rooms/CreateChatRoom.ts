import { ChatRoomMembers } from "../../entities/ChatRoomEntity";
import { ChatType } from "../messages/SendMessageRequest";

/**
 * 	@interface
 */
export interface CreateChatRoom
{
	/**
	 * 	owner's wallet address
	 * 	@type {string}
	 */
	wallet : string;

	/**
	 * 	@type {ChatType}
	 */
	chatType : ChatType;

	/**
	 * 	chat room name
	 * 	@type {string}
	 * 	@description max length was limited to 3-64
	 */
	name : string;

	/**
	 * 	@type {string}
	 * 	@description encryption Key, max length was limited to 8-64
	 */
	encryptionKey ?: string;

	/**
	 * 	@type {string}
	 * 	@description max length was limited to 4-16
	 */
	pinCode ?: string;

	/**
	 * 	chat room id of the message recipient
	 * 	@type {string}
	 * 	@description start with 'p'|'g', and, max length was limited to 42-256
	 */
	roomId ?: string;

	/**
	 * 	@type {string}
	 * 	@description room description, max length was limited to 256
	 */
	desc ?: string;

	/**
	 * 	@type {ChatRoomMembers}
	 * 	@description member list
	 */
	members : ChatRoomMembers;
}
