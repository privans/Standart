
import { ChatRoomEntityItem } from "../entities/ChatRoomEntity";
import { ChatType } from "../models/messages/SendMessageRequest";
import _ from "lodash";
import { ethers, isAddress } from "ethers";
import { AesCrypto } from "debeem-cipher";
import { isHexString } from "ethers";

/**
 * 	@class
 */
export class PrivateMessageCrypto
{
	/**
	 * 	@param message			{string}
	 * 	@param roomItem			{ChatRoomEntityItem}
	 * 	@param fromWallet		{string}
	 * 	@param fromPrivateKey		{string}
	 * 	@returns {Promise<string>}
	 */
	public encryptMessage(
		message : string,
		roomItem : ChatRoomEntityItem,
		fromWallet : string,
		fromPrivateKey : string
	) : Promise<string>
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( message ) || _.isEmpty( message ) )