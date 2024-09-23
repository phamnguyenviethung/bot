import { Document, HydratedDocument } from 'mongoose';
import { IUser } from './../models/user.model';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { BaseRepositoryInterface } from './base/base.interface.repository';
const User = require('../models/user.model');

export interface UserRepositoryInterface
  extends BaseRepositoryInterface<IUser> {}

class UserRepository
  extends BaseRepositoryAbstract<IUser>
  implements UserRepositoryInterface
{
  constructor() {
    super(User);
  }
}
module.exports = UserRepository;
