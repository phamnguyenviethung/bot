import { IMatch } from '@/core/models/match.model';
import MatchService from '@/core/services/match.service';
import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
  Res,
} from 'routing-controllers';
const SuccessResponse = require('@/server/utils/sucess.response');
@JsonController()
export class MatchController {
  private matchService;

  constructor() {
    this.matchService = new MatchService();
  }

  @Get('/matches')
  async getAll(@Res() res: any) {
    const data = await this.matchService.getAll();
    return SuccessResponse(res, data);
  }

  @Get('/matches/:id')
  async getByID(@Param('id') id: string, @Res() res: Response) {
    const data = await this.matchService.getByID(id);

    return SuccessResponse(res, data);
  }

  @Post('/matches')
  async create(@Body() body: Partial<IMatch>, @Res() res: Response) {
    const data = await this.matchService.create(body);
    return SuccessResponse(res, data);
  }

  @Patch('/matches/:id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<IMatch>,
    @Res() res: Response
  ) {
    const data = await this.matchService.update(
      {
        _id: id,
      },
      body
    );
    return SuccessResponse(res, data);
  }

  @Delete('/matches/:id')
  async del(@Param('id') id: string, @Res() res: Response) {
    const data = await this.matchService.permanentlyDelete(id);
    return SuccessResponse(res, data);
  }
}
