import { TeamRepositoryInterface } from '@core/repositories/team.repo';
import { BaseServiceAbstract } from '@core/services/base/base.abstract.service';

const TeamRepo = require('../repositories/team.repo');
const Team = require('../models/team.model');

class TeamService extends BaseServiceAbstract<typeof Team> {
  constructor() {
    const repo: TeamRepositoryInterface = new TeamRepo();
    super(repo);
  }
}

export default TeamService;
