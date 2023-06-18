
import _ from "lodash";
import { io, Socket } from "socket.io-client";
import { ChatRoomStorageService } from "./storages/ChatRoomStorageService";
import { JoinRoomRequest } from "./models/rooms/JoinRoomRequest";
import { JoinRoomResponse } from "./models/rooms/JoinRoomResponse";
import { LeaveRoomResponse } from "./models/rooms/LeaveRoomResponse";
import { LeaveRoomRequest } from "./models/rooms/LeaveRoomRequest";
import { ChatMessage, SendMessageRequest } from "./models/messages/SendMessageRequest";
import { VaJoinRoomRequest } from "./validators/VaJoinRoomRequest";
import { VaLeaveRoomRequest } from "./validators/VaLeaveRoomRequest";
import { VaSendMessageRequest } from "./validators/VaSendMessageRequest";
import { ResponseCallback } from "./models/callbacks/ResponseCallback";
import { ClientReceiveMessageCallback } from "./models/callbacks/ClientReceiveMessageCallback";
import { ExistRoomRequest } from "./models/rooms/ExistRoomRequest";
import { VaExistRoomRequest } from "./validators/VaExistRoomRequest";
import { PullMessageRequest } from "./models/messages/PullMessageRequest";
import { VaPullMessageRequest } from "./validators/VaPullMessageRequest";
import { PrivateMessageBuilder } from "./builders/PrivateMessageBuilder";
import { GroupMessageBuilder } from "./builders/GroupMessageBuilder";
import { CountMessageRequest } from "./models/messages/CountMessageRequest";
import { VaCountMessageRequest } from "./validators/VaCountMessageRequest";
import { TestUtil } from "debeem-utils";
import { isHexString } from "ethers";
import { ExistRoomResponse } from "./models/rooms/ExistRoomResponse";
import { SendMessageResponse } from "./models/messages/SendMessageResponse";
import { PullMessageResponse } from "./models/messages/PullMessageResponse";
import { CountMessageResponse } from "./models/messages/CountMessageResponse";

/**
 * 	@class
 */
export class ClientConnect
{
	serverUrl : string = '';
	socket ! : Socket;
	receiveMessageCallback ! : ClientReceiveMessageCallback;
	chatRoomStorageService ! : ChatRoomStorageService;

	/**
	 *	the timeout value of the .emit method
	 */
	emitTimeout : number = 2000;


	/**
	 *	@param serverUrl	{string}
	 *	@param receiveMessageCallback
	 */
	constructor( serverUrl : string, receiveMessageCallback : ClientReceiveMessageCallback )
	{
		//
		//	documentation:
		//	https://socket.io/docs/v3/client-initialization/
		//
		//	the following forms are similar
		//	const socket = io( "https://server-domain.com" );
		//	const socket = io( "wss://server-domain.com" );
		//
		//	only in the browser when the page is served over https (will not work in Node.js)
		//	const socket = io( "server-domain.com" );
		//
		if ( ! _.isString( serverUrl ) || _.isEmpty( serverUrl ) )
		{
			throw new Error( `${ this.constructor.name }.constructor :: invalid serverUrl` );
		}

		this.serverUrl = serverUrl;
		this.socket = io( serverUrl );
		this.receiveMessageCallback = receiveMessageCallback;
		this.chatRoomStorageService = new ChatRoomStorageService( `` );

		//	...
		this._setupEvents();
	}

	/**
	 * 	update emitTimeout
	 *	@param emitTimeout	{number}
	 */
	public setEmitTimeout( emitTimeout : number ) : boolean
	{
		if ( ! _.isNumber( emitTimeout ) || emitTimeout <= 0 )
		{
			return false;
		}

		this.emitTimeout = emitTimeout;
		return true;
	}


	/**
	 * 	setup
	 *	@private
	 *	@returns {void}
	 */
	private _setupEvents() : void
	{
		/**
		 * 	events
		 */
		this.socket.on( `connect`, () =>
		{
			//	x8WIv7-mJelg7on_ALbx
			console.log( `connected to server, socket.id :`, this.socket.id );
		} );
		this.socket.on( `connect_error`, () =>
		{
			console.log( `connect error, will reconnect later ...` )
			setTimeout( () =>
			{
				this.socket.connect();
			}, 1000 );
		} );
		this.socket.on( `disconnect`, ( reason ) =>