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
			return `invalid joinRoomRe