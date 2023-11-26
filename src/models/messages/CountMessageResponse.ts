
import { BaseResponse } from "../BaseResponse";
import { QueueMessageItem } from "./PullMessageResponse";

/**
 * 	response
 */
export type TsQueueCountResultItem =
{
	/**
	 * 	the key of the Sorted Set
	 */
	channel : string;
	count : number;
	lastElementList ?: Array< QueueMessageItem | null >;
};
export interface CountMessageResponse extends BaseResponse
{
	list : Array< TsQueueCountResultItem >;
}