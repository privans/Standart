
import { CountMessageRequest } from "../models/messages/CountMessageRequest";
import { TypeUtil } from "debeem-utils";
import _ from "lodash";


/**
 * 	@class
 */
export class VaCountMessageRequest
{
	static validateCountOptionItem( item : any ) : string | null
	{
		if ( ! TypeUtil.isNotNullObjectWithKeys( item, [ `channel` ] ) ||
			! _.isString( item.channel ) ||
			_.isEmpty( item.channel ) )
		{
			return `invalid .channel`;
		}
		if ( _.isNumber( item.startTimestamp ) )
		{
			//	0	- the first score
			if ( item.startTimestamp < 0 )
			{
				return `invalid .startTimestamp`;
			}
		}
		if ( _.isNumber( item.endTimestamp ) )
		{
			//
			//	-1		- the last score
			//	-2		- the penultimate element
			//	-3		- the third to last element
			//	...
			//	[timestamp]	- a normal score
			//
		}
		if ( _.isNumber( item.lastElement ) )
		{
			if ( item.lastElement <= 0 )
			{
				return `invalid .lastElement`;
			}
		}

		return null;
	}

	/**
	 *	@param countRequest	{CountMessageRequest}
	 *	@returns {string | null}
	 */
	static validateCountMessageRequest( countRequest : CountMessageRequest ) : string | null
	{
		if ( ! countRequest )
		{
			return `invalid countRequest`;
		}
		if ( ! Array.isArray( countRequest.options ) )
		{
			return `invalid .options`;
		}
		for ( const option of countRequest.options )
		{
			const errorOption = this.validateCountOptionItem( option );
			if ( null !== errorOption )
			{
				return `invalid .options, ${ errorOption }`;
			}
		}

		return null;
	}
}