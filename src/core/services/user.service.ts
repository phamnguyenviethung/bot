import { UserRepositoryInterface } from '../repositories/user.repo';
import { BaseServiceAbstract } from './base/base.abstract.service';

const UserRepo = require('../repositories/user.repo');
const User = require('../models/user.model');

class UserService extends BaseServiceAbstract<typeof User> {
  constructor() {
    const repo: UserRepositoryInterface = new UserRepo();
    super(repo);
  }
}

export default UserService;
