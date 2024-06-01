
import { describe, expect } from '@jest/globals';
import { ChatRoomStorageService } from "../../../src";
import {
	ChatRoomEntityItem,
	ChatRoomMember,
	ChatRoomMembers,
	ChatRoomMemberType
} from "../../../src";
import { ChatType } from "../../../src";
import { EtherWallet } from "debeem-id";
import _, { assignWith, max } from "lodash";
import { VaChatRoomEntityItem } from "../../../src";
import { RoomUtil } from "../../../src";


/**
 *	unit test
 */
describe( "ChatRoomStorageService", () =>
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
			let randomPrivateRoomId = RoomUtil.generateRandomRoomId( ChatType.PRIVATE );
			let randomGroupRoomId = RoomUtil.generateRandomRoomId( ChatType.GROUP );
			const isValidPrivateRoomId = VaChatRoomEntityItem.isValidRoomId( randomPrivateRoomId );
			const isValidGroupRoomId = VaChatRoomEntityItem.isValidRoomId( randomGroupRoomId );
			expect( isValidPrivateRoomId ).toBeNull();
			expect( isValidGroupRoomId ).toBeNull();
		});
	});

	describe( "Test saving Private Chat Room", () =>
	{
		it( "should put a Private Chat Room to database", async () =>
		{
			const chatRoomStorageService = new ChatRoomStorageService( `my password` );
			let randomRoomId = RoomUtil.generateRandomRoomId( ChatType.PRIVATE );
			//console.log( `randomRoomId :`, randomRoomId );

			//	...
			const BobWalletObj = EtherWallet.createWalletFromMnemonic();
			const AliceWalletObj = EtherWallet.createWalletFromMnemonic();
			const passwordValue = await chatRoomStorageService.encryptPassword( '', '' );

			BobWalletObj.address = BobWalletObj.address.trim().toLowerCase();
			AliceWalletObj.address = AliceWalletObj.address.trim().toLowerCase();
			const item : ChatRoomEntityItem = {
				wallet : BobWalletObj.address,
				chatType : ChatType.PRIVATE,
				name : `Alice and Bob\'s chat room`,
				roomId : randomRoomId,
				// desc : 'Alice and Bob',
				password : passwordValue,
				timestamp : new Date().getTime(),
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
			const key : string | null = chatRoomStorageService.getKeyByItem( item );
			expect( key ).toBeDefined();
			expect( _.isString( key ) && ! _.isEmpty( key ) ).toBeTruthy();
			if ( key )
			{
				const saved : boolean = await chatRoomStorageService.put( key, item );
				const itemKey : string | null = chatRoomStorageService.getKeyByItem( item );
				expect( itemKey ).toBeDefined();
				expect( _.isString( itemKey ) && ! _.isEmpty( itemKey ) ).toBeTruthy();
				if ( itemKey )
				{
					const value : ChatRoomEntityItem | null = await chatRoomStorageService.get( itemKey );
					expect( saved ).toBe( true );
					expect( value ).toHaveProperty( 'chatType' );
					expect( value ).toHaveProperty( 'roomId' );
					// expect( value ).toHaveProperty( 'desc' );
					expect( value ).toHaveProperty( 'password' );
					expect( value ).toHaveProperty( 'timestamp' );
					expect( value ).toHaveProperty( 'members' );
					expect( value?.chatType ).toBe( ChatType.PRIVATE );
					expect( value?.roomId ).toBe( item.roomId );
					expect( value?.desc ).toBe( item.desc );
					expect( value?.password ).toBe( item.password );
					expect( value?.timestamp ).toBe( item.timestamp );
					expect( value?.members ).toHaveProperty( BobWalletObj.address );
					expect( value?.members ).toHaveProperty( AliceWalletObj.address );
				}
			}
		});
		// it( "should delete the object just saved", async () =>
		// {
		// 	const deleted : boolean = await chatRoomStorageService.delete( randomRoomId );
		// 	expect( deleted ).toBeTruthy();
		// });

		it( "should delete rooms", async () =>
		{
			const chatRoomStorageService = new ChatRoomStorageService( `my password` );
			await chatRoomStorageService.clear();

			let roomItems : Array< ChatRoomEntityItem > = [];

			const maxRoomCount = 10;
			for ( let i = 0; i < maxRoomCount; i ++ )
			{
				let randomRoomId = RoomUtil.generateRandomRoomId( ChatType.PRIVATE );

				const walletObjAlice = EtherWallet.createWalletFromMnemonic();
				const walletObjBob = EtherWallet.createWalletFromMnemonic();
				const passwordValue = await chatRoomStorageService.encryptPassword( '', '' );

				walletObjBob.address = walletObjBob.address.trim().toLowerCase();
				walletObjAlice.address = walletObjAlice.address.trim().toLowerCase();
				const item : ChatRoomEntityItem = {
					wallet : walletObjBob.address,
					chatType : ChatType.PRIVATE,
					name : `Temp Chat Room[${ i + 1 }]`,
					roomId : randomRoomId,
					password : passwordValue,
					timestamp : new Date().getTime(),
					members : {
						[ walletObjBob.address ] : {