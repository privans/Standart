import { SendMessageRequest } from "./SendMessageRequest";
import { BaseResponse } from "../BaseResponse";

/**
 * 	response
 */
export interface QueueMessageItem
{
	channel : string,
	timestamp : number,
	data : SendMessageRequest,
}

export interface PullMessageResponse extends BaseResponse
{
	total : number,
	pageKey : number,
	list : Array< QueueMessageItem | null >,
}
