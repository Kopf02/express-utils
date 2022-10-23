/**
 * Generics: T is the Data Set Type, I the type of the Primary Key
 * @template T - Data Set Type
 * @template I - Type of Primary key
 */
export interface IDefaultService<T, I> {
  //fetch data
  get: (id: I) => Promise<T | null>;
  //fetch data
  list: () => Promise<T[]>;
  //delete data
  delete: (id: I) => Promise<number>;
  //exec actions && create new data with or without knowing the id
  create: (obj: T, id?: I) => Promise<T | null>;
  //update data
  update: (id: I, obj: T) => Promise<T | null>;
}
