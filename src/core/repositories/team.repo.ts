import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { BaseRepositoryInterface } from './base/base.interface.repository';
const Team = require('../models/team.model');

export interface TeamRepositoryInterface
  extends BaseRepositoryInterface<typeof Team> {}

class TeamRepository
  extends BaseRepositoryAbstract<typeof Team>
  implements TeamRepositoryInterface
{
  constructor() {
    super(Team);
  }
}
module.exports = TeamRepository;
