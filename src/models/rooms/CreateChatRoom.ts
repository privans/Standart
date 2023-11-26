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
	 *