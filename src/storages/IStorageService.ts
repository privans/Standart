
import { PaginationOptions } from "../models/PaginationOptions";

/**
 * 	@export
 */
export type ConditionCallback = ( key : string, item : any, index : number ) => boolean;
export type HandlerCallback = ( row : any, item : any, index : number ) => boolean;

/**
 * 	@interface
 */
export interface IStorageService
{
	isValidItem( item : any ) : string | null;
	encodeItem( value : any ) : Promise<string>;
	decodeItem( encoded : string ) : Promise< any | null >;

	getKeyByItem( value : any ) : string | null;

	get( key : string ) : Promise<any | null>;

	getFirst() : Promise<any | null>;
	getAllKeys( query? : string, maxCount? : number ) : Promise<Array<string> | null>;
	getAll( query? : string, maxCount? : number ) : Promise<Array< any | null> | null>;
	query( condition ?: ConditionCallback, pageOptions ?: PaginationOptions ) : Promise<Array< any | null> | null>;
	update( condition : ConditionCallback, updateHandler : HandlerCallback ) : Promise<number>;

	put( key : string, value : any ) : Promise<boolean>;

	delete( key : string ) : Promise<boolean>;

	clear() : Promise<boolean>;
	count( condition ?: ConditionCallback ) : Promise<number>;
}