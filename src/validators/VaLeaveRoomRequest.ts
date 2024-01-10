
import { LeaveRoomRequest } from "../models/rooms/LeaveRoomRequest";
import { VaChatRoomEntityItem } from "./VaChatRoomEntityItem";

/**
 * 	@class
 */
export class VaLeaveRoomRequest
{
	/**
	 *	@param leaveRequest	{LeaveRoomRequest}
	 *	@returns {string | null}
	 */
	static validateLeaveRoomRequest( leaveRequest : LeaveRoomRequest ) : string | null
	{
		if ( ! leaveRequest )
		{
			return `invalid leaveRequest`;
		}

		const errorRoomId : string | null = VaChatRoomEntityItem.isValidRoomId( leaveRequest.roomId );
		if ( null !== errorRoomId )
		{
			return errorRoomId;
		}

		//	...
		return null;
	}
}