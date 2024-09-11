import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { BaseRepositoryInterface } from './base/base.interface.repository';
const User = require('../models/user.model');

export interface UserRepositoryInterface
  extends BaseRepositoryInterface<typeof User> {}

class UserRepository
  extends BaseRepositoryAbstract<typeof User>
  implements UserRepositoryInterface
{
  constructor() {
    super(User);
  }
}
module.exports = UserRepository;
