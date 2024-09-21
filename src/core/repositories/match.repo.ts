import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { BaseRepositoryInterface } from './base/base.interface.repository';
const Match = require('../models/match.model');

export interface MatchRepositoryInterface
  extends BaseRepositoryInterface<typeof Match> {}

class MatchRepository
  extends BaseRepositoryAbstract<typeof Match>
  implements MatchRepositoryInterface
{
  constructor() {
    super(Match);
  }
}
module.exports = MatchRepository;
