import { ChatRoomEntityItem } from "../../entities/ChatRoomEntity";

export interface InviteRequest
{
	version : string;
	header : string;
	chatRoom : ChatRoomEntityItem;
}

export const clientInviteRequestInitV1 : InviteRequest =
{
	version : '1.0',
	header : 'CHAT_INVITE',
	chatRoom : {} as ChatRoomEntityItem,
};
