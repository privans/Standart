
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
							memberType : ChatRoomMemberType.OWNER,
							wallet : walletObjBob.address,
							publicKey : walletObjBob.publicKey,
							userName : 'Bob',
							userAvatar : 'https://www.aaa/avatar.png',
							timestamp : new Date().getTime()
						},
						[ walletObjAlice.address ] : {
							memberType : ChatRoomMemberType.MEMBER,
							wallet : walletObjAlice.address,
							publicKey : walletObjAlice.publicKey,
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
					expect( saved ).toBeTruthy();
				}

				//	...
				roomItems.push( item );
			}

			//
			//	query all 1
			//
			const allRoomItems1 : Array<ChatRoomEntityItem | null > | null = await chatRoomStorageService.getAll();
			expect( allRoomItems1 ).not.toBeNull();
			expect( Array.isArray( allRoomItems1 ) ).toBeTruthy();
			expect( allRoomItems1 && maxRoomCount === allRoomItems1.length ).toBeTruthy();

			//
			//	delete the first two item
			//
			for ( let i = 0; i < 2; i ++ )
			{
				const item : ChatRoomEntityItem = roomItems[ i ];
				const key : string | null = chatRoomStorageService.getKeyByItem( item );
				if ( key )
				{
					const deleted : boolean = await chatRoomStorageService.delete( key );
					expect( deleted ).toBeTruthy();

					//	remove 1 item from the index
					roomItems.splice( i, 1 );
				}
			}
			expect( roomItems.length ).toBe( maxRoomCount - 2 );

			//
			//	query all 2
			//
			const allRoomItems2 : Array<ChatRoomEntityItem | null > | null = await chatRoomStorageService.getAll();
			//console.log( `allRoomItems2 :`, allRoomItems2 );
			expect( allRoomItems2 ).not.toBeNull();
			expect( Array.isArray( allRoomItems2 ) ).toBeTruthy();
			expect( allRoomItems2 && roomItems.length === allRoomItems2.length ).toBeTruthy();
			expect( allRoomItems2 && maxRoomCount - 2 === allRoomItems2.length ).toBeTruthy();


			//
			//	randomly delete two item
			//
			for ( let i = 0; i < 2; i ++ )
			{
				const count = await chatRoomStorageService.count();
				const randomIndex = Math.floor(Math.random() * count );

				const item : ChatRoomEntityItem = roomItems[ randomIndex ];
				const key : string | null = chatRoomStorageService.getKeyByItem( item );
				if ( key )
				{
					const deleted : boolean = await chatRoomStorageService.delete( key );
					expect( deleted ).toBeTruthy();

					//	remove 1 item from the index
					roomItems.splice( randomIndex, 1 );
				}
			}
			expect( roomItems.length ).toBe( maxRoomCount - 4 );


			//
			//	query all 3
			//
			const allRoomItems3 : Array<ChatRoomEntityItem | null > | null = await chatRoomStorageService.getAll();
			//console.log( `allRoomItems3 :`, allRoomItems3 );
			expect( allRoomItems3 ).not.toBeNull();
			expect( Array.isArray( allRoomItems3 ) ).toBeTruthy();
			expect( allRoomItems3 && roomItems.length === allRoomItems3.length ).toBeTruthy();
			expect( allRoomItems3 && maxRoomCount - 4 === allRoomItems3.length ).toBeTruthy();
		});
	} );


	describe( "Test saving Group Chat Room", () =>
	{
		const chatRoomStorageService = new ChatRoomStorageService( `my password` );
		let randomRoomId = RoomUtil.generateRandomRoomId( ChatType.GROUP );

		const BobWalletObj = EtherWallet.createWalletFromMnemonic();
		const AliceWalletObj = EtherWallet.createWalletFromMnemonic();
		BobWalletObj.address = BobWalletObj.address.trim().toLowerCase();
		AliceWalletObj.address = AliceWalletObj.address.trim().toLowerCase();

		it( "should put a Group Chat Room", async () =>
		{
			const randomPassword = RoomUtil.generateRandomEncryptionKey();
			const pinCode = '';
			const passwordValue = await chatRoomStorageService.encryptPassword( randomPassword, pinCode );

			const item : ChatRoomEntityItem = {
				wallet : BobWalletObj.address,
				chatType : ChatType.GROUP,
				name : 'Group A',
				roomId : randomRoomId,
				desc : 'Group A',
				password : passwordValue,
				timestamp : new Date().getTime(),
				members : {
					[ BobWalletObj.address ] : {
						memberType : ChatRoomMemberType.OWNER,
						wallet : BobWalletObj.address,
						publicKey : undefined,
						userName : 'Bob',
						userAvatar : 'https://www.aaa/avatar.png',
						timestamp : new Date().getTime()
					},
					[ AliceWalletObj.address ] : {
						memberType : ChatRoomMemberType.MEMBER,
						wallet : AliceWalletObj.address,
						publicKey : undefined,
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
				expect( saved ).toBe( true );

				const itemKey : string | null = chatRoomStorageService.getKeyByItem( item );
				expect( itemKey ).toBeDefined();
				expect( _.isString( itemKey ) && ! _.isEmpty( itemKey ) ).toBeTruthy();
				if ( itemKey )
				{
					const value : ChatRoomEntityItem | null = await chatRoomStorageService.get( itemKey );
					expect( value ).toBeDefined();
					expect( value ).toHaveProperty( 'chatType' );
					expect( value ).toHaveProperty( 'roomId' );
					expect( value ).toHaveProperty( 'desc' );
					expect( value ).toHaveProperty( 'password' );
					expect( value ).toHaveProperty( 'timestamp' );
					expect( value ).toHaveProperty( 'members' );
					if ( value )
					{
						expect( value.chatType ).toBe( ChatType.GROUP );
						expect( value.roomId ).toBe( item.roomId );
						expect( value.desc ).toBe( item.desc );
						expect( value.password ).toBe( item.password );
						expect( value.timestamp ).toBe( item.timestamp );
						expect( value.members ).toHaveProperty( BobWalletObj.address );
						expect( value.members ).toHaveProperty( AliceWalletObj.address );
					}
				}
			}
		});

		const MaryWalletObj = EtherWallet.createWalletFromMnemonic();
		const MaryWalletAddress = MaryWalletObj.address.trim().toLowerCase();
		const MaryMember : ChatRoomMember = {
			memberType : ChatRoomMemberType.MEMBER,
			wallet : MaryWalletAddress,
			publicKey : undefined,
			userName : 'Mary',
			userAvatar : 'https://www.aaa/avatar.png',
			timestamp : new Date().getTime()
		};

		it( "should put a new member to Group Chat Room", async () =>
		{
			const key : string | null = chatRoomStorageService.getKeyByWalletAndRoomId( BobWalletObj.address, randomRoomId );
			expect( key ).not.toBeNull();
			expect( chatRoomStorageService.isValidKey( key ) ).toBeTruthy();
			if ( key )
			{
				const saved : boolean = await chatRoomStorageService.putMember( key, MaryMember );
				expect( saved ).toBeTruthy();
			}
		});
		it( "should return all members of a Group Chat Room", async () =>
		{
			const key : string | null = chatRoomStorageService.getKeyByWalletAndRoomId( BobWalletObj.address, randomRoomId );
			expect( key ).not.toBeNull();
			expect( chatRoomStorageService.isValidKey( key ) ).toBeTruthy();
			if ( key )
			{
				//	get all members
				const members : ChatRoomMembers | null = await chatRoomStorageService.getMembers( key );
				expect( members ).toBeDefined();
				expect( _.isObject( members ) && ! _.isEmpty( members ) ).toBeTruthy();
				expect( members ).toHaveProperty( MaryWalletAddress );
				if ( members )
				{
					const member = members[ MaryWalletAddress ];
					expect( member ).toBeDefined();
					expect( member ).toHaveProperty( 'memberType' );
					expect( member ).toHaveProperty( 'wallet' );
					expect( member ).toHaveProperty( 'userName' );
					expect( member ).toHaveProperty( 'userAvatar' );
					expect( member ).toHaveProperty( 'timestamp' );
					expect( member.memberType ).toBe( MaryMember.memberType );
					expect( member.wallet ).toBe( MaryMember.wallet );
					expect( member.publicKey ).toBe( MaryMember.publicKey );
					expect( member.userName ).toBe( MaryMember.userName );
					expect( member.userAvatar ).toBe( MaryMember.userAvatar );
					expect( member.timestamp ).toBe( MaryMember.timestamp );
				}
			}
		});
		it( "should return a member of a Group Chat Room", async () =>
		{
			const key : string | null = chatRoomStorageService.getKeyByWalletAndRoomId( BobWalletObj.address, randomRoomId );
			expect( key ).not.toBeNull();
			expect( chatRoomStorageService.isValidKey( key ) ).toBeTruthy();
			if ( key )
			{
				//	get a member
				const member : ChatRoomMember | null = await chatRoomStorageService.getMember( key, MaryWalletAddress );
				expect( member ).toBeDefined();
				expect( _.isObject( member ) && ! _.isEmpty( member ) ).toBeTruthy();
				if ( member )
				{
					expect( member ).toBeDefined();
					expect( member ).toHaveProperty( 'memberType' );
					expect( member ).toHaveProperty( 'wallet' );
					expect( member ).toHaveProperty( 'userName' );
					expect( member ).toHaveProperty( 'userAvatar' );
					expect( member ).toHaveProperty( 'timestamp' );
					expect( member.memberType ).toBe( MaryMember.memberType );
					expect( member.wallet ).toBe( MaryMember.wallet );
					expect( member.publicKey ).toBe( MaryMember.publicKey );
					expect( member.userName ).toBe( MaryMember.userName );
					expect( member.userAvatar ).toBe( MaryMember.userAvatar );
					expect( member.timestamp ).toBe( MaryMember.timestamp );
				}
			}
		});

		it( "should delete a member from a Group Chat Room", async () =>
		{
			//	get all members
			const key : string | null = chatRoomStorageService.getKeyByWalletAndRoomId( BobWalletObj.address, randomRoomId );
			expect( key ).not.toBeNull();
			expect( chatRoomStorageService.isValidKey( key ) ).toBeTruthy();
			if ( key )
			{
				const deleted : boolean = await chatRoomStorageService.deleteMember( key, MaryWalletAddress );
				expect( deleted ).toBeTruthy();

				const member : ChatRoomMember | null = await chatRoomStorageService.getMember( key, MaryWalletAddress );
				expect( member ).toBeNull();
			}
		});

		it( "should delete the object just saved", async () =>
		{
			const key : string | null = chatRoomStorageService.getKeyByWalletAndRoomId( BobWalletObj.address, randomRoomId );
			expect( key ).not.toBeNull();
			expect( chatRoomStorageService.isValidKey( key ) ).toBeTruthy();
			if ( key )
			{
				const deleted : boolean = await chatRoomStorageService.delete( key );
				expect( deleted ).toBeTruthy();
			}
		});
	} );
} );