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
			