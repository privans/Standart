
import { describe, expect } from '@jest/globals';
import {
	ChatRoomEntityItem, ChatRoomEntityItemExtension,
	ChatRoomMemberType,
	ChatType,
	ClientRoom,
	CreateChatRoom,
	RoomUtil
} from "../../../src";
import { EtherWallet } from "debeem-id";
import _ from "lodash";
import { ClientRoomExtensions } from "../../../src/ClientRoomExtensions";


/**
 *	unit test
 */
describe( "ClientRoomExtensions", () =>
{
	beforeAll( async () =>
	{
	});
	afterAll( async () =>
	{
	});

	describe( "Test saving extensions", () =>
	{
		const clientRoom : ClientRoom = new ClientRoom();
		let randomRoomId = RoomUtil.generateRandomRoomId( ChatType.PRIVATE );

		const BobWalletObj = EtherWallet.createWalletFromMnemonic();
		const AliceWalletObj = EtherWallet.createWalletFromMnemonic();
		BobWalletObj.address = BobWalletObj.address.trim().toLowerCase();
		AliceWalletObj.address = AliceWalletObj.address.trim().toLowerCase();

		it( "should save and read room extended data", async () =>
		{
			const createChatRoom : CreateChatRoom = {
				wallet : AliceWalletObj.address,
				chatType : ChatType.PRIVATE,
				//encryptionKey : encryptionKey,
				//pinCode : pinCode,
				name : `Alice and Bob\'s chat room`,
				roomId : randomRoomId,
				desc : 'Alice and Bob',
				members : {
					[ AliceWalletObj.address ] : {
						memberType : ChatRoomMemberType.OWNER,
						wallet : AliceWalletObj.address,
						publicKey : AliceWalletObj.publicKey,
						userName : 'Alice',
						userAvatar : 'https://www.aaa/avatar.png',
						timestamp : new Date().getTime()
					},
					[ BobWalletObj.address ] : {
						memberType : ChatRoomMemberType.MEMBER,
						wallet : BobWalletObj.address,
						publicKey : BobWalletObj.publicKey,
						userName : 'Bob',
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


			//
			//	update and query extension
			//
			const wallet : string = AliceWalletObj.address;
			const clientRoomExtensions : ClientRoomExtensions = new ClientRoomExtensions();
			const extensions : ChatRoomEntityItemExtension = {
				key1 : 123,
				key2 : `trust me`,
				key3 : { payload : { body : `hello, world`, count : 1 } },
				key4 : null,
				key5 : undefined,
			};
			const updatedExtensionAll : boolean = await clientRoomExtensions.updateExtensionAll( wallet, randomRoomId, extensions );
			expect( updatedExtensionAll ).toBeTruthy();

			const readExtensions : ChatRoomEntityItemExtension | null = await clientRoomExtensions.queryExtensionAll( wallet, randomRoomId );
			//console.log( `readExtensions1 :`, readExtensions )
			expect( readExtensions ).not.toBeNull();
			expect( _.isObject( readExtensions ) ).toBeTruthy();
			expect( _.has( readExtensions, 'key1' ) ).toBeTruthy();
			expect( _.has( readExtensions, 'key2' ) ).toBeTruthy();
			expect( _.has( readExtensions, 'key3' ) ).toBeTruthy();
			expect( _.has( readExtensions, 'key4' ) ).toBeTruthy();
			expect( _.has( readExtensions, 'key5' ) ).toBeFalsy();
			expect( readExtensions && _.isObject( readExtensions[ 'key3' ] ) ).toBeTruthy();
			expect( readExtensions && _.has( readExtensions[ 'key3' ], `payload` ) ).toBeTruthy();
			expect( readExtensions && _.isObject( readExtensions[ 'key3' ][ `payload` ] ) ).toBeTruthy();
			expect( readExtensions && _.has( readExtensions[ 'key3' ][ `payload` ], `body` ) ).toBeTruthy();
			expect( readExtensions && _.has( readExtensions[ 'key3' ][ `payload` ], `count` ) ).toBeTruthy();

			//
			//	delete the value in key2 and key2
			//
			const deletedExtension : boolean = await clientRoomExtensions.deleteExtension( wallet, randomRoomId, `key2` );
			expect( deletedExtension ).toBeTruthy();

			//	read again
			const readExtensionsAfterDeletion : ChatRoomEntityItemExtension | null = await clientRoomExtensions.queryExtensionAll( wallet, randomRoomId );
			//console.log( `readExtensionsAfterDeletion :`, readExtensionsAfterDeletion );
			expect( readExtensionsAfterDeletion ).not.toBeNull();
			expect( _.isObject( readExtensionsAfterDeletion ) ).toBeTruthy();
			expect( _.has( readExtensionsAfterDeletion, 'key1' ) ).toBeTruthy();
			expect( _.has( readExtensionsAfterDeletion, 'key2' ) ).toBeFalsy();
			expect( _.has( readExtensionsAfterDeletion, 'key3' ) ).toBeTruthy();
			expect( _.has( readExtensionsAfterDeletion, 'key4' ) ).toBeTruthy();
			expect( _.has( readExtensionsAfterDeletion, 'key5' ) ).toBeFalsy();

			//	read the value in key1
			const valueOfKey1 : any = await clientRoomExtensions.queryExtension( wallet, randomRoomId, `key1` );
			expect( valueOfKey1 ).not.toBeNull();
			expect( valueOfKey1 ).toBe( 123 );

			//	read the value in key3
			const valueOfKey3 : any = await clientRoomExtensions.queryExtension( wallet, randomRoomId, `key3` );
			expect( valueOfKey3 ).not.toBeNull();
			expect( valueOfKey3 && _.isObject( valueOfKey3 ) ).toBeTruthy();
			expect( valueOfKey3 && _.has( valueOfKey3, `payload` ) ).toBeTruthy();
			expect( valueOfKey3 && _.isObject( valueOfKey3[ `payload` ] ) ).toBeTruthy();
			expect( valueOfKey3 && _.has( valueOfKey3[ `payload` ], `body` ) ).toBeTruthy();
			expect( valueOfKey3 && _.has( valueOfKey3[ `payload` ], `count` ) ).toBeTruthy();