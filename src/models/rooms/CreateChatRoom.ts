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
	 * 	@descripti