import { BetRepositoryInterface } from '@core/repositories/bet.repo';
import { BaseServiceAbstract } from '@core/services/base/base.abstract.service';

const BetRepo = require('../repositories/bet.repo');
const Bet = require('../models/bet.model');

class BetService extends BaseServiceAbstract<typeof Bet> {
  constructor() {
    const repo: BetRepositoryInterface = new BetRepo();
    super(repo);
  }
}

export default BetService;
