
export interface BaseResponse
{
	/**
	 * 	server id
	 */
	serverId : string;

	/**
	 * 	service version
	 */
	version : string;

	/**
	 * 	use HTTP Status
	 */
	status : number;

	/**
	 * 	error description
	 */
	error ?: string;

	/**
	 * 	now timestamp
	 */
	timestamp : number;
}

export const defaultVersionNumber : string = `1.0`;