import { describe, expect } from '@jest/globals';
import { v4 as UUIDv4 } from 'uuid';
import { ChatType } from "../../../src";
import _ from "lodash";
import { ChatHistoryStorageService } from "../../../src";
import { ChatHistoryEntityItem } from "../../../src";
import { PaginationOptions } from "../../../src";
import { RoomUtil } from "../../../src";

/**
 *	unit test
 */
describe( "ChatHistoryStorageService", () =>
{
	beforeAll( async () =>
	{
	});
	afterAll( async () =>
	{
	});

	describe( "Test saving Private Chat Room", () =>
	{
		const chatHistoryStorageService = new ChatHistoryStorageService();
		let randomRoomId = RoomUtil.generateRandomRoomId( ChatType.GROUP );

		it( "should put some histories", async () =>
		{
			for ( let i = 0; i < 100; i ++ )
			{
				const history : ChatHistoryEntityItem = {
					uuid: UUIDv4().toString(),
					roomId : randomRoomId,
					userName : `User-${ i }`,
					userAvatar : `https://www.a.com/${ i }.png`,
					body : `it's the body`,
					timestamp : new Date().getTime()
				};
				const key : string | null = chatHistoryStorageService.getKeyByItem( history );
				expect( key ).not.toBeNull();
				if ( key )
				{
					const saved = await chatHistoryStorageService.put( key, history );
					expect( saved ).toBeTruthy();
				}
			}
		});

		it( "should query histories", async () =>
		{
			const historyList : Array<ChatHistoryEntityItem | null> | null = await chatHistoryStorageService.query( ( _key : string, item : any, _index : number ) : boolean =>
			{
				return item.userName === `User-0`;
			});
			//console.log( `list :`, historyList );
			//	should output:
			//	list : [
			//       {
			//         roomId: 'g0x9dac6a85f48d2967480622eed576e941573c874e',
			//         userName: 'User-0',
			//         userAvatar: 'https://www.a.com/0.png',
			//         body: "it's the body",
			//         timestamp: 1699337767806
			//       }
			//     ]
			expect( historyList ).not.toBeNull();
			expect( Array.isArray( historyList ) ).toBeTruthy();
			if ( historyList )
			{
				expect( historyList.length ).toBeGreaterThanOrEqual( 1 );
				for ( const historyItem of historyList )
				{
					expect( historyItem ).not.toBeNull();
					expect( _.isObject( historyItem ) ).toBeTruthy();
					expect( historyItem ).toHaveProperty( 'roomId' );
					expect( historyItem ).toHaveProperty( 'userName' );
					expect( historyItem ).toHaveProperty( 'userAvatar' );
					expect( historyItem ).toHaveProperty( 'body' );
					expect( historyItem ).toHaveProperty( 'timestamp' );
					if ( historyItem )
					{
						expect( historyItem.userName ).toBe( `User-0` );
					}
				}
			}
		});

		it( "should query histories in paginated format", async () =>
		{
			for ( let i = 1; i <= 10; i ++ )
			{
				const pageOptions : PaginationOptions = {
					pageNo : i,
					pageSize : 10
				}
				const historyList : Array<ChatHistoryEntityItem | null> | null = await chatHistoryStorageService.query( ( _key : string, _item : any, _index : number ) : boolean =>
				{
					return true;
				}, pageOptions );
				//console.log( `historyList pageNo:${ i } :`, historyList );
				//	historyList pageNo:10 : [
				//       {
				//         uuid: 'e42bc49f-2620-434c-9ba9-009846d81edb',
				//         roomId: 'g0xe94dd9b1d264f516a17db9a2afdea9f4f496fd6a',
				//         userName: 'User-4',
				//         userAvatar: 'https://www.a.com/4.png',
				//         body: "it's the body",
				//         timestamp: 1699342522835
				//       },
				//       {
				//         uuid: 'e95b61b3-f816-4013-a227-1cbd6d196b6f',
				//         roomId: 'g0xe94dd9b1d264f516a17db9a2afdea9f4f496fd6a',
				//         userName: 'User-62',
				//         userAvatar: 'https://www.a.com/62.png',
				//         body: "it's the body",
				//         timestamp: 1699342522847
				//       },
				//       {
				//         uuid: 'ed8e1f72-4498-4eeb-ae73-baf58a40f169',
				//         roomId: 'g0xe94dd9b1d264f516a17db9a2afdea9f4f496fd6a',
				//         userName: 'User-71',
				//         userAvatar: 'https://www.a.com/71.png',
				//         body: "it's the body",
				//         timestamp: 1699342522848
				//       },
				//       {
				//         uuid: 'ee75ab59-b7bb-4af0-a1e4-33b30e91ee9f',
				//         roomId: 'g0xe94dd9b1d264f516a17db9a2afdea9f4f496fd6a',
				//         userName: 'User-72',
				//         userAvatar: 'https://www.a.com/72.png',
				//         body: "it's the body",
				//         timestamp: 1699342522849
				//       },
				//       {
				//         uuid: 'ef0e18a6-30a5-404f-97f7-b38595f41253',
				//         roomId: 'g0xe94dd9b1d264f516a17db9a2afdea9f4f496fd6a',
				//         userName: 'User-10',
				//         userAvatar: 'https://www.a.com/10.png',
				//         body: "it's the body",
				//         timestamp: 1699342522836
				//       },
				//       {
				//         uuid: 'f107f206-7870-4702-ac08-0b7e1d69d268',
				//         roomId: 'g0xe94dd9b1d264f516a17db9a2afdea9f4f496fd6a',
				//         userName: 'User-5',
				//         userAvatar: 'https://www.a.com/5.png',
				//         body: "it's the body",
				//         timestamp: 1699342522835
				//       },
				//       {
				//         uuid: 'f36f51d9-50a9-4e85-bd35-871d9da6b7d9',
				//         roomId: 'g0xe94dd9b1d264f516a17db9a2afdea9f4f496fd6a',
				//         userName: 'User-67',
				//         userAvatar: 'https://www.a.com/67.png',
				//         body: "it's the body",
				//         timestamp: 1699342522848
				//       },
				//       {
				//         uuid: 'f5da4a14-27d4-49b5-b290-44b7aac05e3f',
				//         roomId: 'g0xe94dd9b1d264f516a17db9a2afdea9f4f496fd6a',
				//         userName: 'User-12',
				//         userAvatar: 'https://www.a.com/12.png',
				//         body: "it's the body",
				//         timestamp: 1699342522836
				//       },
				//       {
				//         uuid: 'fc249876-af2c-4514-b079-4cb88248b38e',
				//         roomId: 'g0xe94dd9b1d264f516a17db9a2afdea9f4f496fd6a',
				//         userName: 'User-21',
				//         userAvatar: 'https://www.a.com/21.png',
				//         body: "it's the body",
				//         timestamp: 1699342522838
				//       },
				//       {
				//         uuid: 'fda494f3-d1c3-489f-be91-3cde5a8314a1',
				//         roomId: 'g0xe94dd9b1d264f516a17db9a2afdea9f4f496fd6a',
				//         userName: 'User-20',
				//         userAvatar: 'https://www.a.com/20.png',
				//         body: "it's the body",
				//         timestamp: 1699342522838
				//       }
				//     ]
				expect( historyList ).not.toBeNull();
				expect( Array.isArray( historyList ) ).toBeTruthy();
				if ( historyList )
				{
					expect( historyList.length ).toBe( 10 );
					for ( const historyItem of historyList )
					{
						expect( historyItem ).not.toBeNull();
						expect( _.isObject( historyItem ) );
						expect( historyItem ).toHaveProperty( 'uuid' );
						expect( historyItem ).toHaveProperty( 'roomId' );
						expect( historyItem ).toHaveProperty( 'userName' );
						expect( historyItem ).toHaveProperty( 'userAvatar' );
						expect( historyItem ).toHaveProperty( 'body' );
						expect( historyItem ).toHaveProperty( 'timestamp' );
					}
				}
			}

		});
	} );
} );
