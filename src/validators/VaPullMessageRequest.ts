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
		if ( ! pullRequest )
		{
			return `invalid pullRequest`;
		}

		const errorRoomId : string | null = VaChatRoomEntityItem.isValidRoomId( pullRequest.roomId );
		if ( null !== errorRoomId )
		{
			return errorRoomId;
		}

		if ( ! _.isNumber( pullRequest.startTimestamp ) )
		{
			return `invalid .startTimestamp`;
		}
		if ( pullRequest.startTimestamp < -1 )
		{
			return `invalid .startTimestamp, too young`;
		}

		if ( ! _.isNumber( pullRequest.endTimestamp ) )
		{
			return `invalid .endTimestamp`;
		}
		if ( pullRequest.endTimestamp < -1 )
		{
			return `invalid .endTimestamp, too young`;
		}

		//	...
		return null;
	}
}
