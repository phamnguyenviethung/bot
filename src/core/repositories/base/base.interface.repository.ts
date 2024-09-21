import { FilterQuery, Model } from 'mongoose';
import { FindAllResponse } from '../../../common/types/common.types';

export interface BaseRepositoryInterface<T> {
  create(dto: T | any): Promise<T>;

  getByID(id: string, projection?: string): Promise<T>;

  getOne(condition?: object, projection?: string): Promise<T>;

  getAll(condition: object, options?: object): Promise<FindAllResponse<T>>;

  update(filter: FilterQuery<T>, dto: Partial<T>, isNew?: boolean): Promise<T>;

  permanentlyDelete(id: string): Promise<boolean>;
}
