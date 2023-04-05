/**
 * Generics: T is the Data Set Type, I the type of the Primary Key
 * @template T - Data Set Type
 * @template I - Type of Primary key
 */
export interface IDefaultService<T, I> {
  //fetch data
  get: (id: I, options?: Record<string, never>) => Promise<T | null>;
  //fetch data
  list: (options?: Record<string, never>) => Promise<T[]>;
  //delete data
  delete: (id: I, options?: Record<string, never>) => Promise<number>;
  //exec actions && create new data with or without knowing the id
  create: (obj: T, id?: I, options?: Record<string, never>) => Promise<T>;
  //update data
  update: (id: I, obj: T, options?: Record<string, never>) => Promise<T | null>;
}
