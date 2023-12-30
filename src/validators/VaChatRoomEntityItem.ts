
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

		return null;
	}

	/**
	 * 	@param roomName	{any}
	 * 	@returns {string | null}
	 */
	static isValidRoomName( roomName : any ) : string | null
	{
		if ( ! _.isString( roomName ) )
		{
			return `invalid .name`;
		}
		if ( roomName.length < Constants.minLengthRoomName || roomName.length > Constants.maxLengthRoomName )
		{
			return `length of .name exceeds limit to ${ Constants.minLengthRoomName }-${ Constants.maxLengthRoomName }`;
		}

		return null;
	}


	/**
	 * 	@param roomId	{any}
	 * 	@returns {string | null}
	 */
	static isValidRoomId( roomId : any ) : string | null
	{
		if ( ! _.isString( roomId ) )
		{
			return `invalid .roomId`;
		}
		if ( roomId.length < Constants.minLengthRoomId || roomId.length > Constants.maxLengthRoomId )
		{
			return `length of .roomId exceeds limit to ${ Constants.minLengthRoomId }-${ Constants.maxLengthRoomId }`;
		}
		if ( ! roomId.startsWith( 'p' ) && ! roomId.startsWith( 'g' ) )
		{
			return `invalid .roomId, invalid format`;
		}

		const roomAddress : string = roomId.substring( 1 );
		if ( ! isAddress( roomAddress ) )
		{
			return `invalid .roomId, invalid address`;
		}

		return null;
	}

	/**
	 * 	@param desc	{any}
	 * 	@returns {string | null}
	 */
	static isValidDesc( desc : any ) : string | null
	{
		if ( ! _.isString( desc ) )
		{
			return `invalid .desc`;
		}
		if ( desc.length > Constants.maxLengthDesc )
		{
			return `invalid .desc, must be less than ${ Constants.maxLengthDesc } characters`;
		}

		return null;
	}

	/**
	 * 	@param password	{any}
	 * 	@returns {string | null}
	 */
	static isValidPassword( password : any ) : string | null
	{
		if ( _.isString( password ) )
		{
			if ( password.length > Constants.maxLengthPassword )
			{
				return `invalid .password, must be less than ${ Constants.maxLengthPassword } characters`;
			}
		}

		return null;
	}

	/**
	 * 	@param timestamp	{any}
	 * 	@returns {string | null}
	 */
	static isValidTimestamp( timestamp : any ) : string | null
	{
		if ( ! timestamp ||
			timestamp <= 0 )
		{
			return `invalid .timestamp`;
		}
		if ( timestamp > ( new Date().getTime() + 60 * 60 * 1000 ) )
		{
			//	already 1 hour later than the current time
			return `invalid .timestamp, much later than the current time`;
		}

		// const minutesAgoTimestamp = new Date( new Date().getTime() - 5 * 60 * 1000 ).getTime();
		// if ( timestamp < minutesAgoTimestamp )
		// {
		// 	return `invalid message.timestamp, too old`;
		// }

		return null;
	}

	/**
	 *	@param mute	{any}
	 *	@returns {string | null}
	 */
	static isValidMute( mute : any ) : string | null
	{
		if ( ! _.isBoolean( mute ) )
		{
			return `invalid mute`;
		}

		return null;
	}

	/**
	 *	@param members	{ChatRoomMembers}
	 *	return {string | null}
	 */
	static isValidMembers( members : ChatRoomMembers ) : string | null
	{
		if ( ! _.isObject( members ) ||
			Object.keys( members ).length < 1 )
		{
			return `invalid .members`;
		}

		const owner = RoomUtil.matchRoomOwner( members );
		if ( ! _.isObject( owner ) || _.isEmpty( owner ) )
		{
			return `invalid .members, OWNER not found`;
		}

		for ( const memberWallet in members )
		{
			const errorChatRoomMember : string | null = VaChatRoomMember.validateChatRoomMember( members[ memberWallet ] );
			if ( null !== errorChatRoomMember )
			{
				return errorChatRoomMember;
			}
		}

		return null;
	}

	/**
	 *	@param item	{ChatRoomEntityUnreadItem}
	 *	@returns {string | null}
	 */
	static validateChatRoomEntityUnreadItem( item : ChatRoomEntityUnreadItem ) : string | null
	{
		if ( ! item )
		{
			return `invalid item`;
		}

		const errorRoomId : string | null = this.isValidRoomId( item.roomId );
		if ( null !== errorRoomId )
		{
			return errorRoomId;
		}

		if ( ! _.isNumber( item.unreadCount ) )
		{
			return `invalid .unreadCount`;
		}

		return null;
	}

	/**
	 *	@param item	{ChatRoomEntityItem}
	 *	@returns {string | null}
	 */
	static validateChatRoomEntityItem( item : ChatRoomEntityItem ) : string | null
	{
		if ( ! item )
		{
			return `invalid item`;
		}

		const errorWallet : string | null = this.isValidWallet( item.wallet );
		if ( null !== errorWallet )
		{
			return errorWallet;
		}

		if ( ! ( item.chatType in ChatType ) )
		{
			return `invalid .chatType`;
		}

		const errorRoomName : string | null = this.isValidRoomName( item.name );
		if ( null !== errorRoomName )
		{
			return errorRoomName;
		}

		const errorRoomId : string | null = this.isValidRoomId( item.roomId );
		if ( null !== errorRoomId )
		{
			return errorRoomId;
		}

		if ( _.isString( item.desc ) )
		{
			const errorDesc : string | null = this.isValidDesc( item.desc );
			if ( null !== errorDesc )
			{
				return errorDesc;
			}
		}

		if ( undefined !== item.mute )
		{
			const errorMute : string | null = this.isValidMute( item.mute );
			if ( null !== errorMute )
			{
				return errorMute;
			}
		}

		const errorPassword : string | null = this.isValidPassword( item.password );
		if ( null !== errorPassword )
		{
			return errorPassword;
		}

		const errorMembers : string | null = this.isValidMembers( item.members );
		if ( null !== errorMembers )
		{
			return errorMembers;
		}

		return null;
	}
}