import { DBSchema } from "idb";

/**
 * 	@interface
 */
export interface ChatHistoryEntityItem
{
	//	id with lower cases,
	//	e.g.: `64af0c7b-709a-440f-885b-242f191878de`
	uuid : string;

	/**
	 * 	chat room id of the message recipient
	 * 	@type {string}
	 * 	@description start with 'p'|'g', and, max length was limited to 42-256
	 */
	roomId : string;

	/**
	 * 	@type {string}
	 * 	@description user name, max length was limited to 3-64
	 */
	userName : string;

	/**
	 * 	@type {string}
	 * 	@description url of user avatar, max length was limited to 256
	 */
	userAvatar? : string;

	/**
	 * 	@type {string}
	 * 	@description body text
	 */
	body : string;

	/**
	 * 	@type {boolean}
	 * 	@description true - already been read
	 */
	read? : boolean;

	/**
	 *	@type {number}
	 *	@description created time in millisecond
	 */
	timestamp : number;
}

/**
 * 	@interface
 */
export interface ChatHistoryEntity extends DBSchema
{
	//	store name
	root: {
		key: string;
		value: string;
	};
	// root : {
	// 	key : string;
	// 	value : {
	// 		roomId : string;
	// 		userName : string;
	// 		userAvatar? : string;
	// 		body : string;
	// 		read? : boolean;
	// 		timestamp : number;
	// 	};
	// 	indexes : { 'by-roomId' : string };
	// };
}
