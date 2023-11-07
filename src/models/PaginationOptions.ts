export enum PaginationOrder
{
	/**
	 * 	sort by score in ascending order
	 */
	ASC = 1,

	/**
	 * 	sort by score in descending order
	 */
	DESC = 2
}

/**
 * 	@export
 */
export interface PaginationOptions
{
	pageNo ?: number;
	pageSize ?: number;
	order ?: PaginationOrder;
}
