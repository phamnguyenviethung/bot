import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { BaseRepositoryInterface } from './base/base.interface.repository';
const Bet = require('../models/bet.model');

export interface BetRepositoryInterface
  extends BaseRepositoryInterface<typeof Bet> {}

class BetRepository
  extends BaseRepositoryAbstract<typeof Bet>
  implements BetRepositoryInterface
{
  constructor() {
    super(Bet);
  }
}
module.exports = BetRepository;
