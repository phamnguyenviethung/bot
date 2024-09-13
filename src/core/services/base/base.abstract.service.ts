import { FindAllResponse } from '../../../common/types/common.types';
import { BaseRepositoryInterface } from '../../repositories/base/base.interface.repository';
import { BaseServiceInterface } from './base.interface.service';

export abstract class BaseServiceAbstract<T>
  implements BaseServiceInterface<T>
{
  constructor(private readonly repo: BaseRepositoryInterface<T>) {
    this.repo = repo;
  }

  async create(item: T | any): Promise<T> {
    return await this.repo.create(item);
  }
  async getAll(filter?: object, options?: object): Promise<FindAllResponse<T>> {
    return await this.repo.getAll(filter, options);
  }
  async getOne(filter?: object, projection?: string): Promise<T> {
    return await this.repo.getOne(filter, projection);
  }
  async getByID(id: string): Promise<T> {
    return await this.repo.getByID(id);
  }

  async update(id: string, update_dto: Partial<T>): Promise<T> {
    return await this.repo.update(id, update_dto);
  }

  async permanentlyDelete(id: string): Promise<boolean> {
    return await this.repo.permanentlyDelete(id);
  }
}
