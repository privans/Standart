
import _ from "lodash";
import { Constants } from "../constants/Constants";

/**
 * 	@class
 */
export class VaChatHistoryEntityItem
{
	static isValidUUID( uuid : any ) : string | null
	{
		if ( ! _.isString( uuid ) || _.isEmpty( uuid ) )
		{
			return `invalid .uuid`;
		}
		if ( 36 !== uuid.length )
		{
			return `invalid .uuid, invalid length`;
		}

		return null;
	}

	static isValidBody( body : any ) : string | null
	{
		if ( ! _.isString( body ) || _.isEmpty( body ) )
		{
			return `invalid .body`;
		}
		if ( body.length > Constants.maxLengthBody )
		{
			return `invalid .body, must be less than ${ Constants.maxLengthBody } characters`;
		}

		return null;
	}
}