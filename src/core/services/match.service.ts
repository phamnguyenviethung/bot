import { MatchRepositoryInterface } from '@core/repositories/match.repo';
import { BaseServiceAbstract } from '@core/services/base/base.abstract.service';

const MatchRepo = require('../repositories/match.repo');
const Match = require('../models/match.model');

class MatchService extends BaseServiceAbstract<typeof Match> {
  constructor() {
    const repo: MatchRepositoryInterface = new MatchRepo();
    super(repo);
  }
}

export default MatchService;
