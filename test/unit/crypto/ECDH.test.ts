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
			const alicePrivateKey = `0x2f2b8e6b059254fa4709898eb82cb0b372e24acc94329000d6887c140e9b4f22`;
			const alicePublicKey = `0x0388447f78493804b3d885988d6a81b5e1a2b6c9496d314ae7e6c5efd376c7adea`;

			const bobPrivateKey = `0xf8ba731e3d09ce93ee6256d7393e993be01cd84de044798372c0d1a8ad9b952a`;
			const bobPub