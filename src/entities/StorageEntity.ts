import { DBSchema } from 'idb';

/**
 * 	https://github.com/jakearchibald/idb
 */
export interface StorageEntity extends DBSchema
{
	//	store name
	root: {
		key: string;
		value: string;
	};
}
