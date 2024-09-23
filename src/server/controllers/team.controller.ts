import { ITeam } from '@/core/models/team.model';
import TeamService from '@/core/services/team.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
  Res,
  UseAfter,
} from 'routing-controllers';
const SuccessResponse = require('@/server/utils/sucess.response');
@JsonController()
export class TeamController {
  private teamService;

  constructor() {
    this.teamService = new TeamService();
  }

  @Get('/teams')
  async getAll(@Res() res: any) {
    const data = await this.teamService.getAll();
    return SuccessResponse(res, data);
  }

  @Get('/teams/:id')
  async getByID(@Param('id') id: string, @Res() res: Response) {
    const data = await this.teamService.getByID(id);

    return SuccessResponse(res, data);
  }

  @Post('/teams')
  async create(@Body() body: Partial<ITeam>, @Res() res: Response) {
    const data = await this.teamService.create(body);
    return SuccessResponse(res, data);
  }

  @Patch('/teams/:id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<ITeam>,
    @Res() res: Response
  ) {
    const data = await this.teamService.update(
      {
        _id: id,
      },
      body
    );
    return SuccessResponse(res, data);
  }

  @Delete('/teams/:id')
  async del(@Param('id') id: string, @Res() res: Response) {
    const data = await this.teamService.permanentlyDelete(id);
    return SuccessResponse(res, data);
  }
}
