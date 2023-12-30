
import { EtherWallet } from "debeem-id";
import _ from "lodash";
import { Constants } from "../constants/Constants";
import { ChatRoomMember, ChatRoomMemberType } from "../entities/ChatRoomEntity";
import { VaChatRoomEntityItem } from "./VaChatRoomEntityItem";

/**
 * 	@class
 */
export class VaChatRoomMember
{
	/**
	 *	@param userName	{string}
	 *	@returns {string | null}
	 */
	static isValidUserName( userName : string ) : string | null
	{
		if ( ! _.isString( userName ) || _.isEmpty( userName ) )
		{
			return `invalid .userName`;
		}
		if ( userName.length < Constants.minLengthUserName ||
			userName.length > Constants.maxLengthUserName )
		{
			return `length of .userName exceeds limit ${Constants.minLengthUserName}-${ Constants.maxLengthUserName }`;
		}

		return null;
	}

	/**
	 *	@param userAvatar	{string}
	 *	@returns {string | null}
	 */
	static isValidUserAvatar( userAvatar ?: string ) : string | null
	{
		if ( ! _.isString( userAvatar ) || _.isEmpty( userAvatar ) )
		{
			return `invalid .userAvatar`;
		}
		if ( userAvatar.length < Constants.minLengthUserAvatar ||
			userAvatar.length > Constants.maxLengthUserName )
		{
			return `length of .userAvatar exceeds limit ${ Constants.minLengthUserAvatar }-${ Constants.maxLengthUserName }`;
		}

		return null;
	}


	/**
	 *	@param item	{ChatRoomMember}
	 *	@returns {Promise<boolean>}
	 */
	static validateChatRoomMember( item : ChatRoomMember ) : string | null
	{
		if ( ! item )
		{
			return `invalid item`;
		}

		if ( ! ( item.memberType in ChatRoomMemberType ) )
		{
			return `invalid .memberType`;
		}

		if ( ! EtherWallet.isValidAddress( item.wallet ) )
		{
			return `invalid .wallet`;
		}

		const errorUserName : string | null = this.isValidUserName( item.userName );
		if ( null !== errorUserName )
		{
			return errorUserName;
		}

		if ( undefined !== item.userAvatar )
		{
			const errorUserAvatar : string | null = this.isValidUserAvatar( item.userAvatar );
			if ( null !== errorUserAvatar )
			{
				return errorUserAvatar;
			}
		}

		if ( undefined !== item.timestamp )
		{
			const errorTimestamp : string | null = VaChatRoomEntityItem.isValidTimestamp( item.timestamp );
			if ( null !== errorTimestamp )
			{
				return errorTimestamp;
			}
		}

		//	...
		return null;
	}
}