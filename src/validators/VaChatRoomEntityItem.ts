
import { isAddress } from 'ethers';
import { ChatRoomEntityItem, ChatRoomEntityUnreadItem, ChatRoomMembers } from "../entities/ChatRoomEntity";
import _ from "lodash";
import { Constants } from "../constants/Constants";
import { ChatType } from "../models/messages/SendMessageRequest";
import { VaChatRoomMember } from "./VaChatRoomMember";
import { RoomUtil } from "../utils/RoomUtil";

export class VaChatRoomEntityItem
{
	/**
	 *	@param wallet	{string}
	 * 	@returns {string | null}
	 */
	static isValidWallet( wallet : string ) : string | null
	{
		if ( ! isAddress( wallet ) )
		{
			return `invalid .wallet`;
		}