/**
 * 	count
 */
export type CountMessageOptionItem =
{
	/**
	 * 	the key of the Sorted Set
	 */
	channel : string;

	/**
	 * 	if the user specifies this parameter,
	 * 	statistics will start from this parameter.
	 * 	default to 0
	 */
	startTimestamp ?: number;

	/**
	 * 	if the user specifies this parameter,
	 * 	statistics will end with this param