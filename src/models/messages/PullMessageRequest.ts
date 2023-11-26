
import { PaginationOptions } from "../PaginationOptions";

export type PullMessageRequest =
{
	/**
	 * 	chat room id of the message recipient
	 * 	@type {string}
	 * 	@description start with 'p'|'g', and, max length was limited to 256
	 */
	roomId: string;

	/**
	 * 	start timestamp
	 *	@type {number}
	 *	@description 0 means the beginning of the queue, -1 means the last of the queue.
	 */
	startTimestamp : number;

	/**
	 * 	end timestamp
	 *	@type {number}
	 *	@description 0 means the beginning of the queue, -1 means the last of the queue.
	 */
	endTimestamp : number;

	/**
	 * 	pagination
	 */
	pagination ?: PaginationOptions;
};