
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
			}

			try
			{
				await clientRoom.createRoom( createChatRoom );
			}
			catch ( err )
			{
				expect( err ).toContain( `invalid owner's publicKey` );
			}
		});

		// it( "should delete the object just saved", async () =>
		// {
		// 	const deleted : boolean = await clientRoom.deleteRoom( BobWalletObj.address, randomRoomId );
		// 	expect( deleted ).toBeTruthy();
		// });

		it( "should delete rooms for a wallet", async () =>
		{
			const chatRoomStorageService = new ChatRoomStorageService( `my password` );
			await chatRoomStorageService.clear();

			//	...
			const clientRoom : ClientRoom = new ClientRoom();
			let roomItems : Array< CreateChatRoom > = [];

			const maxRoomCount = 10;
			const walletObjBob = EtherWallet.createWalletFromMnemonic();
			for ( let i = 0; i < maxRoomCount; i ++ )
			{
				let randomRoomId = RoomUtil.generateRandomRoomId( ChatType.PRIVATE );
				const walletObjRandom = EtherWallet.createWalletFromMnemonic();

				walletObjBob.address = walletObjBob.address.trim().toLowerCase();
				walletObjRandom.address = walletObjRandom.address.trim().toLowerCase();

				const createChatRoom : CreateChatRoom = {
					wallet : walletObjBob.address,
					chatType : ChatType.PRIVATE,
					name : `Chat Room ${ i }`,
					roomId : randomRoomId,
					desc : 'Alice and Bob',
					members : {
						[ walletObjBob.address ] : {
							memberType : ChatRoomMemberType.OWNER,
							wallet : walletObjBob.address,
							publicKey : walletObjBob.publicKey,
							userName : 'Bob',
							userAvatar : 'https://www.aaa/avatar.png',
							timestamp : new Date().getTime()
						},
						[ walletObjRandom.address ] : {
							memberType : ChatRoomMemberType.MEMBER,
							wallet : walletObjRandom.address,
							publicKey : walletObjRandom.publicKey,
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
				expect( chatRoomEntityItem?.members ).toHaveProperty( walletObjBob.address );
				expect( chatRoomEntityItem?.members ).toHaveProperty( walletObjRandom.address );

				//	...
				roomItems.push( createChatRoom );
			}

			//
			//	query all 1
			//
			const allRoomItems1 : Array<ChatRoomEntityItem | null > | null = await clientRoom.queryRooms( walletObjBob.address );
			expect( allRoomItems1 ).not.toBeNull();
			expect( Array.isArray( allRoomItems1 ) ).toBeTruthy();
			expect( allRoomItems1 && maxRoomCount === allRoomItems1.length ).toBeTruthy();

			//
			//	delete the first two item
			//
			for ( let i = 0; i < 2; i ++ )
			{
				const item : CreateChatRoom = roomItems[ i ];
				expect( !! item ).toBeTruthy();
				expect( !! item.roomId ).toBeTruthy();

				if ( item && item.roomId )
				{
					const deleted : boolean = await clientRoom.deleteRoom( walletObjBob.address, item.roomId );
					expect( deleted ).toBeTruthy();

					//	remove 1 item from the index
					roomItems.splice( i, 1 );
				}
			}
			expect( roomItems.length ).toBe( maxRoomCount - 2 );

			//
			//	query all 2
			//
			const allRoomItems2 : Array<ChatRoomEntityItem | null > | null = await clientRoom.queryRooms( walletObjBob.address );
			expect( allRoomItems2 ).not.toBeNull();
			expect( Array.isArray( allRoomItems2 ) ).toBeTruthy();
			expect( allRoomItems2 && roomItems.length === allRoomItems2.length ).toBeTruthy();
			expect( allRoomItems2 && maxRoomCount - 2 === allRoomItems2.length ).toBeTruthy();


			//
			//	randomly delete two item
			//
			for ( let i = 0; i < 2; i ++ )
			{
				const allRoomItemsForCount : Array<ChatRoomEntityItem | null > | null = await clientRoom.queryRooms( walletObjBob.address );
				expect( allRoomItemsForCount ).not.toBeNull();
				expect( Array.isArray( allRoomItemsForCount ) ).toBeTruthy();
				const count = allRoomItemsForCount?.length;
				expect( count ).toBeGreaterThan( 0 );

				const randomIndex = Math.floor(Math.random() * count );
				const item : CreateChatRoom = roomItems[ randomIndex ];
				expect( !! item ).toBeTruthy();
				expect( !! item.roomId ).toBeTruthy();

				if ( item && item.roomId )
				{
					const deleted : boolean = await clientRoom.deleteRoom( walletObjBob.address, item.roomId );
					expect( deleted ).toBeTruthy();

					//	remove 1 item from the index
					roomItems.splice( randomIndex, 1 );
				}
			}
			expect( roomItems.length ).toBe( maxRoomCount - 4 );

			//
			//	query all 3
			//
			const allRoomItems3 : Array<ChatRoomEntityItem | null > | null = await clientRoom.queryRooms( walletObjBob.address );
			expect( allRoomItems3 ).not.toBeNull();
			expect( Array.isArray( allRoomItems3 ) ).toBeTruthy();
			expect( allRoomItems3 && roomItems.length === allRoomItems3.length ).toBeTruthy();
			expect( allRoomItems3 && maxRoomCount - 4 === allRoomItems3.length ).toBeTruthy();
		});
	} );


	describe( "Test saving Group Chat Room", () =>
	{
		const clientRoom : ClientRoom = new ClientRoom();
		let randomRoomId = RoomUtil.generateRandomRoomId( ChatType.GROUP );
		const BobWalletObj = EtherWallet.createWalletFromMnemonic();
		const AliceWalletObj = EtherWallet.createWalletFromMnemonic();

		BobWalletObj.address = BobWalletObj.address.trim().toLowerCase();
		AliceWalletObj.address = AliceWalletObj.address.trim().toLowerCase();

		it( "should put a Group Chat Room", async () =>
		{
			const encryptionKey = RoomUtil.generateRandomEncryptionKey();
			const pinCode = undefined;

			const createChatRoom : CreateChatRoom = {
				wallet : BobWalletObj.address,
				encryptionKey : encryptionKey,
				pinCode : pinCode,
				chatType : ChatType.GROUP,
				name : 'Group A',
				roomId : randomRoomId,
				desc : 'Group A',
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
			const chatRoomEntityItem : ChatRoomEntityItem = await clientRoom.createRoom( createChatRoom );
			expect( chatRoomEntityItem ).not.toBeNull();
			expect( chatRoomEntityItem ).toHaveProperty( 'chatType' );
			expect( chatRoomEntityItem ).toHaveProperty( 'roomId' );
			expect( chatRoomEntityItem ).toHaveProperty( 'desc' );
			expect( chatRoomEntityItem ).toHaveProperty( 'password' );
			expect( chatRoomEntityItem ).toHaveProperty( 'timestamp' );
			expect( chatRoomEntityItem ).toHaveProperty( 'members' );
			expect( chatRoomEntityItem?.chatType ).toBe( ChatType.GROUP );
			expect( chatRoomEntityItem?.roomId ).toBe( createChatRoom.roomId );
			expect( chatRoomEntityItem?.desc ).toBe( createChatRoom.desc );
			expect( chatRoomEntityItem?.members ).toHaveProperty( BobWalletObj.address );
			expect( chatRoomEntityItem?.members ).toHaveProperty( AliceWalletObj.address );

			const members : ChatRoomMembers = await clientRoom.queryMembers( BobWalletObj.address, randomRoomId );
			expect( _.isObject( members ) ).toBeTruthy();
			expect( Object.keys( members ).length ).toBe( 2 );
		});

		it( "should create a GROUP Chat invitation and then accept it", async () =>
		{
			//
			//	will create a new chat room
			//
			const createChatRoom : CreateChatRoom = {
				wallet : BobWalletObj.address,
				chatType : ChatType.GROUP,
				name : 'Group A',
				desc : 'Group A',
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
			const createdChatRoom : ChatRoomEntityItem = await clientRoom.createRoom( createChatRoom );
			expect( createdChatRoom ).not.toBeNull();

			//
			//	create invitation
			//
			const inviteRequest : InviteRequest | null = await clientRoom.inviteMember( BobWalletObj.address, createdChatRoom.roomId );
			expect( inviteRequest ).not.toBeNull();
			expect( _.isObject( inviteRequest ) ).toBeTruthy();

			//
			//	accept and save it into database
			//
			const inviteString = JSON.stringify( inviteRequest );
			const member : ChatRoomMember = {
				memberType : ChatRoomMemberType.MEMBER,
				wallet : AliceWalletObj.address,
				publicKey : AliceWalletObj.publicKey,
				userName : 'Alice',
				userAvatar : 'https://wwa.com/adf.act.jpg',
				timestamp : new Date().getTime()
			};
			const chatRoomEntityItem : ChatRoomEntityItem = await clientRoom.acceptInvitation( inviteString, member );
			expect( chatRoomEntityItem ).not.toBeNull();
			expect( _.isObject( chatRoomEntityItem ) ).toBeTruthy();

			//
			//	query members, it should contain only the room owner
			//
			const members : ChatRoomMembers = await clientRoom.queryMembers( BobWalletObj.address, createdChatRoom.roomId );
			expect( _.isObject( members ) ).toBeTruthy();
			expect( Object.keys( members ).length ).toBe( 2 );
		});
		it( "should throw error of `unable to add yourself` while trying to accept GROUP Chat invitation", async () =>
		{
			//
			//	will create a new chat room
			//
			const createChatRoom : CreateChatRoom = {
				wallet : BobWalletObj.address,
				chatType : ChatType.GROUP,
				name : 'Group A',
				desc : 'Group A',
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
			const createdChatRoom : ChatRoomEntityItem = await clientRoom.createRoom( createChatRoom );
			expect( createdChatRoom ).not.toBeNull();

			//
			//	create invitation
			//
			const inviteRequest : InviteRequest | null = await clientRoom.inviteMember( BobWalletObj.address, createdChatRoom.roomId );
			expect( inviteRequest ).not.toBeNull();
			expect( _.isObject( inviteRequest ) ).toBeTruthy();

			//
			//	accept and save it into the database
			//
			const inviteString = JSON.stringify( inviteRequest );
			const member : ChatRoomMember = {
				memberType : ChatRoomMemberType.MEMBER,
				wallet : BobWalletObj.address,
				publicKey : undefined,
				userName : 'Bob',
				userAvatar : 'https://www.aaa/avatar.png',
				timestamp : new Date().getTime()
			};
			try
			{
				await clientRoom.acceptInvitation( inviteString, member );
			}
			catch ( err )
			{
				expect( err ).toContain( `unable to add yourself` );
			}
		});


		it( "should create an PRIVATE Chat invitation and then accept it", async () =>
		{
			//
			//	will create a new chat room
			//
			const createChatRoom : CreateChatRoom = {
				wallet : BobWalletObj.address,
				chatType : ChatType.PRIVATE,
				name : 'Group A',
				desc : 'Group A',
				members : {
					[ BobWalletObj.address ] : {
						memberType : ChatRoomMemberType.OWNER,
						wallet : BobWalletObj.address,
						publicKey : BobWalletObj.publicKey,
						userName : 'Bob',
						userAvatar : 'https://www.aaa/avatar.png',
						timestamp : new Date().getTime()
					}
				},
			};
			const createdChatRoom : ChatRoomEntityItem = await clientRoom.createRoom( createChatRoom );
			expect( createdChatRoom ).not.toBeNull();

			//
			//	create invitation
			//
			const inviteRequest : InviteRequest | null = await clientRoom.inviteMember( BobWalletObj.address, createdChatRoom.roomId );
			expect( inviteRequest ).not.toBeNull();
			expect( _.isObject( inviteRequest ) ).toBeTruthy();

			//
			//	accept and save it into database
			//
			const inviteString = JSON.stringify( inviteRequest );
			const member : ChatRoomMember = {
				memberType : ChatRoomMemberType.MEMBER,
				wallet : AliceWalletObj.address,
				publicKey : AliceWalletObj.publicKey,
				userName : 'Alice',
				userAvatar : 'https://wwa.com/adf.act.jpg',
				timestamp : new Date().getTime()
			};
			const chatRoomEntityItem : ChatRoomEntityItem = await clientRoom.acceptInvitation( inviteString, member );
			expect( chatRoomEntityItem ).not.toBeNull();
			expect( _.isObject( chatRoomEntityItem ) ).toBeTruthy();

			//
			//	query members, it should contain only the room owner
			//
			const members : ChatRoomMembers = await clientRoom.queryMembers( AliceWalletObj.address, createdChatRoom.roomId );
			expect( _.isObject( members ) ).toBeTruthy();
			expect( Object.keys( members ).length ).toBe( 2 );
		});
		// it( "should throw exception `number of members reached the upper limit for creating invitation`", async () =>
		// {
		// 	//
		// 	//	will create a new chat room
		// 	//
		// 	const createChatRoom : CreateChatRoom = {
		// 		wallet : BobWalletObj.address,
		// 		chatType : ChatType.PRIVATE,
		// 		name : 'Group A',
		// 		desc : 'Group A',
		// 		members : {
		// 			[ BobWalletObj.address ] : {
		// 				memberType : ChatRoomMemberType.OWNER,
		// 				wallet : BobWalletObj.address,
		// 				publicKey : BobWalletObj.publicKey,
		// 				userName : 'Bob',
		// 				userAvatar : 'https://www.aaa/avatar.png',
		// 				timestamp : new Date().getTime()
		// 			},
		// 			[ AliceWalletObj.address ] : {
		// 				memberType : ChatRoomMemberType.MEMBER,
		// 				wallet : AliceWalletObj.address,
		// 				publicKey : undefined,
		// 				userName : 'Alice',
		// 				userAvatar : 'https://www.aaa/avatar.png',
		// 				timestamp : new Date().getTime()
		// 			}
		// 		},
		// 	};
		// 	const createdChatRoom : ChatRoomEntityItem = await clientRoom.createRoom( createChatRoom );
		// 	expect( createdChatRoom ).not.toBeNull();
		//
		// 	//
		// 	//	create invitation
		// 	//
		// 	try
		// 	{
		// 		await clientRoom.inviteMember( BobWalletObj.address, createdChatRoom.roomId );
		// 	}
		// 	catch ( err )
		// 	{
		// 		expect( err ).toContain( `number of members reached the upper limit for creating invitation` );
		// 	}
		// });

		it( "should throw error of `unable to add yourself` while trying to accept PRIVATE Chat invitation", async () =>
		{
			//
			//	will create a new chat room
			//
			const createChatRoom : CreateChatRoom = {
				wallet : BobWalletObj.address,
				chatType : ChatType.PRIVATE,
				name : 'Group A',
				desc : 'Group A',
				members : {
					[ BobWalletObj.address ] : {
						memberType : ChatRoomMemberType.OWNER,
						wallet : BobWalletObj.address,
						publicKey : BobWalletObj.publicKey,
						userName : 'Bob',
						userAvatar : 'https://www.aaa/avatar.png',
						timestamp : new Date().getTime()
					},
					// [ AliceWalletObj.address ] : {
					// 	memberType : ChatRoomMemberType.MEMBER,
					// 	wallet : AliceWalletObj.address,
					// 	publicKey : AliceWalletObj.publicKey,
					// 	userName : 'Alice',
					// 	userAvatar : 'https://www.aaa/avatar.png',
					// 	timestamp : new Date().getTime()
					// }
				},
			};
			const createdChatRoom : ChatRoomEntityItem = await clientRoom.createRoom( createChatRoom );
			expect( createdChatRoom ).not.toBeNull();

			//
			//	create invitation
			//
			const inviteRequest : InviteRequest | null = await clientRoom.inviteMember( BobWalletObj.address, createdChatRoom.roomId );
			expect( inviteRequest ).not.toBeNull();
			expect( _.isObject( inviteRequest ) ).toBeTruthy();

			//
			//	accept and save it into the database
			//
			const inviteString = JSON.stringify( inviteRequest );
			const member : ChatRoomMember = {
				memberType : ChatRoomMemberType.MEMBER,
				wallet : BobWalletObj.address,
				publicKey : BobWalletObj.publicKey,
				userName : 'Bob',
				userAvatar : 'https://www.aaa/avatar.png',
				timestamp : new Date().getTime()
			};
			try
			{
				await clientRoom.acceptInvitation( inviteString, member );
			}
			catch ( err )
			{
				expect( err ).toContain( `unable to add yourself` );
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
		it( "should put an member named Mary", async () =>
		{
			const saved : boolean = await clientRoom.putMember( BobWalletObj.address, randomRoomId, MaryMember );
			expect( saved ).toBeTruthy();
		});

		it( "should return all members of a Group Chat Room", async () =>
		{
			//	get all members
			const members : ChatRoomMembers = await clientRoom.queryMembers( BobWalletObj.address, randomRoomId );
			expect( members ).toBeDefined();
			expect( _.isObject( members ) && ! _.isEmpty( members ) ).toBeTruthy();
			expect( Object.keys( members ).length ).toBe( 3 );
			expect( members ).toHaveProperty( MaryWalletAddress );
			expect( members ).toHaveProperty( BobWalletObj.address.trim().toLowerCase() );
			expect( members ).toHaveProperty( AliceWalletObj.address.trim().toLowerCase() );
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
		});
		it( "should return a member of a Group Chat Room", async () =>
		{
			const member : ChatRoomMember | null = await clientRoom.getMember( BobWalletObj.address, randomRoomId, MaryWalletAddress );
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
		});

		it( "should delete a member from a Group Chat Room", async () =>
		{
			const deleted : boolean = await clientRoom.deleteMember( BobWalletObj.address, randomRoomId, MaryWalletAddress );
			expect( deleted ).toBeTruthy();

			const member : ChatRoomMember | null = await clientRoom.getMember( BobWalletObj.address, randomRoomId, MaryWalletAddress );
			expect( member ).toBeNull();
		});

		it( "should delete the object just saved", async () =>
		{
			const key : string | null = clientRoom.chatRoomStorageService.getKeyByWalletAndRoomId( BobWalletObj.address, randomRoomId );
			expect( key ).not.toBeNull();
			expect( clientRoom.chatRoomStorageService.isValidKey( key ) ).toBeTruthy();
			if ( key )
			{
				const deleted : boolean = await clientRoom.chatRoomStorageService.delete( key );
				expect( deleted ).toBeTruthy();
			}
		});



		it( "should return all rooms", async () =>
		{
			const rooms : Array<ChatRoomEntityItem> = await clientRoom.queryRooms();
			expect( Array.isArray( rooms ) ).toBeTruthy();
			expect( rooms.length ).toBeGreaterThanOrEqual( 0 );
			for ( const room of rooms )
			{
				//console.log( `room :`, room );
				expect( room ).not.toBeNull();
				expect( room ).toHaveProperty( 'chatType' );
				expect( room ).toHaveProperty( 'roomId' );
				expect( room ).toHaveProperty( 'desc' );
				expect( room ).toHaveProperty( 'password' );
				expect( room ).toHaveProperty( 'timestamp' );
				expect( room ).toHaveProperty( 'members' );
				expect( room.chatType in ChatType ).toBeTruthy();
				expect( _.isObject( room.members ) ).toBeTruthy();
				expect( Array.isArray( Object.keys( room.members ) ) ).toBeTruthy();
				expect( Object.keys( room.members ).length ).toBeGreaterThanOrEqual( 0 );
				for ( const memberKey in room.members )
				{
					expect( _.isString( memberKey ) ).toBeTruthy();
					const member = room.members[ memberKey ];
					expect( member ).toBeDefined();
					expect( member ).toHaveProperty( 'memberType' );
					expect( member ).toHaveProperty( 'wallet' );
					expect( member ).toHaveProperty( 'userName' );
					expect( member ).toHaveProperty( 'userAvatar' );
					expect( member ).toHaveProperty( 'timestamp' );
					expect( member.memberType in ChatRoomMemberType ).toBeTruthy();
					expect( EtherWallet.isValidAddress( member.wallet ) ).toBeTruthy();
				}
			}
		});

		it( "should query rooms one by on", async () =>
		{
			const rooms : Array<ChatRoomEntityItem> = await clientRoom.queryRooms();
			expect( Array.isArray( rooms ) ).toBeTruthy();
			expect( rooms.length ).toBeGreaterThanOrEqual( 0 );
			for ( const room of rooms )
			{
				//console.log( `room :`, room );
				expect( room ).not.toBeNull();
				expect( room ).toHaveProperty( 'chatType' );
				expect( room ).toHaveProperty( 'roomId' );

				const roomItem : ChatRoomEntityItem | null = await clientRoom.queryRoom( BobWalletObj.address, room.roomId );
				expect( roomItem ).not.toBeNull();
				expect( roomItem ).not.toBeNull();
				expect( roomItem ).toHaveProperty( 'chatType' );
				expect( roomItem ).toHaveProperty( 'roomId' );
				expect( roomItem ).toHaveProperty( 'desc' );
				expect( roomItem ).toHaveProperty( 'password' );
				expect( roomItem ).toHaveProperty( 'timestamp' );
				expect( roomItem ).toHaveProperty( 'members' );
			}
		});
	} );
} );