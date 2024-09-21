import { UserRepositoryInterface } from '@core/repositories/user.repo';
import { BaseServiceAbstract } from '@core/services/base/base.abstract.service';
import { HydratedDocument, Model } from 'mongoose';

const UserRepo = require('../repositories/user.repo');
const User = require('../models/user.model');

class UserService extends BaseServiceAbstract<typeof User> {
  constructor() {
    const repo: UserRepositoryInterface = new UserRepo();
    super(repo);
  }
}

export default UserService;
