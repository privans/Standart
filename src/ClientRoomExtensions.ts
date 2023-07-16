
import { ClientRoom } from "./ClientRoom";
import { ChatRoomEntityItem, ChatRoomEntityItemExtension } from "./entities/ChatRoomEntity";
import _ from "lodash";
import { VaChatRoomEntityItem } from "./validators/VaChatRoomEntityItem";

/**
 * 	@class ClientRoomExtensions
 */
export class ClientRoomExtensions extends ClientRoom
{
	/**
	 * 	@param wallet	{string}
	 * 	@param roomId	{string}
	 * 	@param key	{string}
	 * 	@returns {Promise<any>}
	 */
	public queryExtension( wallet : string, roomId : string, key : string ) : Promise< any >
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! _.isString( key ) || _.isEmpty( key ) )
				{
					return reject( `${ this.constructor.name }.queryExtension :: invalid key` );
				}

				const extensionAll : ChatRoomEntityItemExtension | null = await this.queryExtensionAll( wallet, roomId );