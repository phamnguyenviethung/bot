import { FindAllResponse } from '../../../common/types/common.types';

export interface Write<T> {
  create(item: T | any): Promise<T>;
  update(filter: object, data: Partial<T>, isNew?: boolean): Promise<T>;
  permanentlyDelete(id: string): Promise<boolean>;
}

export interface Read<T> {
  getAll(filter?: object, options?: object): Promise<FindAllResponse<T>>;
  getOne(filter?: object, projection?: string): Promise<T>;
  getByID(id: string): Promise<T>;
}

export interface BaseServiceInterface<T> extends Write<T>, Read<T> {}
