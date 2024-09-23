import { FindAllResponse } from '../../../common/types/common.types';

export interface Write<T extends Document> {
  create(item: T | any): Promise<T>;
  update(filter: object, data: Partial<T>, isNew?: boolean): Promise<T>;
  permanentlyDelete(id: string): Promise<boolean>;
}

export interface Read<T extends Document> {
  getAll(filter?: object, options?: object): Promise<T[]>;
  getOne(filter?: object, projection?: string): Promise<T>;
  getByID(id: string): Promise<T>;
}

export interface BaseServiceInterface<T extends Document>
  extends Write<T>,
    Read<T> {}
