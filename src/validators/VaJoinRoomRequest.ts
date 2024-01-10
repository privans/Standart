import { JoinRoomRequest } from "../models/rooms/JoinRoomRequest";
import { VaChatRoomEntityItem } from "./VaChatRoomEntityItem";

/**
 * 	@class
 */
export class VaJoinRoomRequest
{
	/**
	 *	@param joinRoomRequest	{JoinRoomRequest}
	 *	@returns {string | null}
	 */
	static validateJoinRoomRequest( joinRoomRequest : JoinRoomRequest ) : string | null
	{
		if ( ! joinRoomRequest )
		{
			return `invalid joinRoomRequest`;
		}

		const errorRoomId : string | null = VaChatRoomEntityItem.isValidRoomId( joinRoomRequest.roomId );
		if ( null !== errorRoomId )
		{
			return errorRoomId;
		}

		//	...
		return null;
	}
}
