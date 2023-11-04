
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
	 * 	@type {string}
	 * 	@description user name, max length was limited to 64
	 */
	userName : string;

	/**
	 * 	@type {string}
	 * 	@description url of user avatar, max length was limited to 256
	 */
	userAvatar ?: string;

	/**
	 *	@type {number}
	 *	@description added time in millisecond, default is new Date().getTime();
	 */
	timestamp ?: number;

	/**
	 * 	@type {boolean}
	 * 	@description true if the member was removed
	 */
	removed ?: boolean;
}

export interface ChatRoomMembers
{
	[ key : string ] : ChatRoomMember;
}

/**
 * 	@interface
 */
export interface ChatRoomEntityBaseItem
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
	 * 	chat room id of the message recipient
	 * 	@type {string}
	 * 	@description start with 'p'|'g', and, max length was limited to 42-256
	 */
	roomId : string;

	/**
	 * 	@type {string}
	 * 	@description room description, max length was limited to 256
	 */
	desc ?: string;

	/**
	 * 	@type {boolean}
	 * 	@description mute
	 */
	mute ?: boolean;

	/**
	 * 	@type {ChatRoomMembers}
	 * 	@description member list
	 */
	members : ChatRoomMembers;
}


/**
 * 	@interface
 */
export interface ChatRoomEntityUnreadItem
{
	/**
	 * 	chat room id of the message recipient
	 * 	@type {string}
	 * 	@description start with 'p'|'g', and, max length was limited to 42-256
	 */
	roomId: string;

	/**
	 *	@type {number}
	 *	@description unread count
	 */
	unreadCount : number;

	/**
	 *	@type {ChatMessage}
	 *	@description latest ChatMessage
	 */
	unreadLatestMessage ?: ChatMessage;
}

/**
 * 	@interface
 */
export interface ChatRoomEntityItemExtension
{
	[ key: string ] : any;
}

/**
 * 	@interface
 */
export interface ChatRoomEntityItem extends ChatRoomEntityBaseItem
{
	/**
	 * 	@type {string}
	 * 	@description Using the Aes256 algorithm, the result obtained by using pinCode as the key to encrypt `encryptionKey`.
	 * 		     max length was limited to 256.
	 * 	see: ChatRoomStorageService.encryptPassword(value, pinCode)
	 */
	password : string;

	/**
	 *	@type {number}
	 *	@description created timestamp in millisecond
	 */
	timestamp : number;

	/**
	 *	@type {ChatMessage}
	 *	@description latest ChatMessage
	 */
	latestMessage ?: ChatMessage;

	/**
	 *	@type {number}
	 *	@description unread count
	 */
	unread ?: ChatRoomEntityUnreadItem;

	/**
	 *	@type {ChatRoomEntityItemExtension}
	 *	@description extension
	 */
	extensions ?: ChatRoomEntityItemExtension;
}