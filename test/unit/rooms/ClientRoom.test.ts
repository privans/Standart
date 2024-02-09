
import { describe, expect } from '@jest/globals';
import {
	ChatRoomEntityItem,
	ChatRoomMember,
	ChatRoomMembers,
	ChatRoomMemberType, ChatRoomStorageService,
	ChatType,
	ClientRoom,
	CreateChatRoom,
	InviteRequest,
	RoomUtil
} from "../../../src";
import { EtherWallet } from "debeem-id";
import _ from "lodash";


/**
 *	unit test
 */
describe( "ClientRoom", () =>
{
	beforeAll( async () =>
	{
	});
	afterAll( async () =>
	{
	});

	describe( "Test saving Private Chat Room", () =>
	{
		it( "should put a Private Chat Room to database", async () =>
		{
			const clientRoom : ClientRoom = new ClientRoom();
			let randomRoomId = RoomUtil.generateRandomRoomId( ChatType.PRIVATE );

			const BobWalletObj = EtherWallet.createWalletFromMnemonic();
			const AliceWalletObj = EtherWallet.createWalletFromMnemonic();
			//const encryptionKey = RoomUtil.generateRandomEncryptionKey();
			//const pinCode = undefined;
			BobWalletObj.address = BobWalletObj.address.trim().toLowerCase();
			AliceWalletObj.address = AliceWalletObj.address.trim().toLowerCase();

			const createChatRoom : CreateChatRoom = {
				wallet : BobWalletObj.address,
				chatType : ChatType.PRIVATE,
				//encryptionKey : encryptionKey,
				//pinCode : pinCode,
				name : `Alice and Bob\'s chat room`,
				roomId : randomRoomId,
				desc : 'Alice and Bob',
				members : {
					[ BobWalletObj.address ] : {
						memberType : ChatRoomMemberType.OWNER,
						wallet : BobWalletObj.address,
						publicKey : BobWalletObj.publicKey,
						userName : 'Bob',
						userAvatar : 'https://www.aaa/avatar.png',
						timestamp : new Date().getTime()
					},
					[ AliceWalletObj.address ] : {
						memberType : ChatRoomMemberType.MEMBER,
						wallet : AliceWalletObj.address,
						publicKey : AliceWalletObj.publicKey,
						userName : 'Alice',
						userAvatar : 'https://www.aaa/avatar.png',
						timestamp : new Date().getTime()
					}
				},
			};
			const chatRoomEntityItem : ChatRoomEntityItem = await clientRoom.createRoom( createChatRoom );
			expect( chatRoomEntityItem ).not.toBeNull();
			expect( chatRoomEntityItem ).toHaveProperty( 'chatType' );
			expect( chatRoomEntityItem ).toHaveProperty( 'roomId' );
			expect( chatRoomEntityItem ).toHaveProperty( 'desc' );
			expect( chatRoomEntityItem ).toHaveProperty( 'password' );
			expect( chatRoomEntityItem ).toHaveProperty( 'timestamp' );
			expect( chatRoomEntityItem ).toHaveProperty( 'members' );
			expect( chatRoomEntityItem?.chatType ).toBe( ChatType.PRIVATE );
			expect( chatRoomEntityItem?.roomId ).toBe( createChatRoom.roomId );
			expect( chatRoomEntityItem?.desc ).toBe( createChatRoom.desc );
			expect( chatRoomEntityItem?.members ).toHaveProperty( BobWalletObj.address );
			expect( chatRoomEntityItem?.members ).toHaveProperty( AliceWalletObj.address );
		});
		it( "should throw an error of `invalid owner's publicKey`", async () =>
		{
			const clientRoom : ClientRoom = new ClientRoom();
			let randomRoomId = RoomUtil.generateRandomRoomId( ChatType.PRIVATE );
