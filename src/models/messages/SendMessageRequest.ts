
export enum ChatType
{
	UNKNOWN = 0,

	/**
	 * 	One-to-one private chat
	 */
	PRIVATE = 1,

	/**
	 * 	group chat
	 */
	GROUP = 2
}

export enum MessageType
{
	UNKNOWN = 0,

	/**
	 * 	user messages
	 */
	USER = 1,

	/**
	 * 	system messages
	 */
	SYSTEM = 2
}

export type ChatMessage =
{
	/**
	 * 	chat type
	 * 	private, group
	 */
	chatType: ChatType;

	/**
	 *	message type
	 *	user, system. default value is user
	 */
	messageType : MessageType;

	/**
	 * 	wallet address of the message sender
	 * 	@type {string}
	 * 	@description start with 0x, hex strings with 42 characters
	 */
	wallet: string;

	/**
	 * 	for Private Chat only
	 * 	publicKey related to wallet address
	 * 	@type {string}
	 */
	publicKey ?: string;

	/**
	 * 	name string
	 * 	@type {string}
	 * 	@description max length was limited to 128
	 */
	fromName: string;

	/**
	 * 	from avatar url
	 * 	@type {string}
	 * 	@description max length was limited to 256
	 */
	fromAvatar: string;

	/**
	 * 	chat room id of the message recipient
	 * 	@type {string}
	 * 	@description start with 'p'|'g', and, max length was limited to 42-256
	 */
	roomId: string;

	/**
	 * 	encrypted message string
	 * 	@type {string}
	 * 	@description max length was limited to 4096
	 */
	body : string;

	/**
	 * 	timestamp in time zone 0 when the message was created,
	 * 	specified by the client
	 * 	@type {number}
	 */
	timestamp: number;

	/**
	 * 	hash value of the packet
	 * 	@type {string}
	 * 	@description hex string consisting of 64 characters starting with 0x
	 */
	hash: string;

	/**
	 * 	signature of a message by the message creator
	 * 	using his or her own wallet’s private key.
	 * 	@type {string}
	 * 	@description hex string consisting of 132 characters starting with 0x
	 */
	sig: string;
};

export type SendMessageRequest =
{
	payload : ChatMessage;
};