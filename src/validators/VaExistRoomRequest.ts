import { VaChatRoomEntityItem } from "./VaChatRoomEntityItem";
import { ExistRoomRequest } from "../models/rooms/ExistRoomRequest";

/**
 * 	@class
 */
export class VaExistRoomRequest
{
	/**
	 *	@param existRoomRequest	{ExistRoomRequest}
	 *	@returns {string | null}
	 */
	static validateExistRoomRequest( existRoomRequest : ExistRoomRequest ) : string | null
	{
		if ( ! existRoomRequest )
		{
			return `invalid existInRoomRequest`;
		}

		const errorRoomId : string | null = VaChatRoomEntityItem.isValidRoomId( existRoomRequest.roomId );
		if ( null !== errorRoomId )
		{
			return errorRoomId;
		}

		//	...
		return null;
	}
}
