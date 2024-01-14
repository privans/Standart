import { describe, expect } from '@jest/globals';
import { ethers, isHexString } from "ethers";

/**
 *	unit test
 */
describe( "ECDH", () =>
{
	beforeAll( async () =>
	{
	} );
	afterAll( async () =>
	{
	} );

	describe( "Test ECDH", () =>
	{
		it( "should create shared secrets by ethers", () =>
		{
			const alicePrivateKey = `0x2f2b8e6b059254fa4709898eb82cb0b372e24acc94329000d6887c140