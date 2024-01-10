import { PullMessageRequest } from "../models/messages/PullMessageRequest";
import { VaChatRoomEntityItem } from "./VaChatRoomEntityItem";
import _ from "lodash";

/**
 * 	@class
 */
export class VaPullMessageRequest
{
	/**
	 *	@param pullRequest	{PullMessageRequest}
	 *	@returns {string | null}
	 */
	static validatePullMessageRequest( pullRequest : PullMessageRequest ) : string | null
	{
		if