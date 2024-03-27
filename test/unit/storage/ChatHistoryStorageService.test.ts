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
			