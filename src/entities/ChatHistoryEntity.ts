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
	 * 	@description user name, max length was limited to 3-