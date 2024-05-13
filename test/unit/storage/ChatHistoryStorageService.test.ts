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
		