import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { BaseRepositoryInterface } from './base.interface.repository';
import { FindAllResponse } from '../../../common/types/common.types';

export abstract class BaseRepositoryAbstract<T>
  implements BaseRepositoryInterface<T>
{
  constructor(private readonly model: Model<T>) {
    this.model = model;
  }

  async create(data: T | any): Promise<T> {
    const res = this.model.create(data);
    return res;
  }

  async getByID(id: string, projection?: string): Promise<T> {
    const res = await this.model.findById(id).select(projection);
    return res;
  }

  async getOne(condition = {}, projection?: string): Promise<T> {
    const res = await this.model.findOne(condition).select(projection);
    return res;
  }
  async getAll(
    condition: FilterQuery<T>,
    options?: QueryOptions<T>
  ): Promise<FindAllResponse<T>> {
    const [count, data] = await Promise.all([
      this.model.countDocuments({ ...condition }),
      this.model.find(
        { ...condition, deleted_at: null },
        options?.projection,
        options
      ),
    ]);
    return {
      count,
      data,
    };
  }

  async update(
    id: string,
    data: Partial<T>,
    isNew: boolean = true
  ): Promise<T> {
    return await this.model.findOneAndUpdate({ _id: id }, data, { new: isNew });
  }

  async permanentlyDelete(id: string): Promise<boolean> {
    const item = await this.model.findById(id);
    if (!item) {
      return false;
    }
    return !!(await this.model.findByIdAndDelete(id));
  }
}
