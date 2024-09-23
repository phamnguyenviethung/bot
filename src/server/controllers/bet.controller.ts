import { IBet } from '@/core/models/bet.model';
import BetService from '@/core/services/bet.service';
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
export class BetController {
  private betService;

  constructor() {
    this.betService = new BetService();
  }

  @Get('/bets')
  async getAll(@Res() res: any) {
    const data = await this.betService.getAll();
    return SuccessResponse(res, data);
  }

  @Get('/bets/:id')
  async getByID(@Param('id') id: string, @Res() res: Response) {
    const data = await this.betService.getByID(id);

    return SuccessResponse(res, data);
  }

  @Post('/bets')
  async create(@Body() body: Partial<IBet>, @Res() res: Response) {
    const data = await this.betService.create(body);
    return SuccessResponse(res, data);
  }

  @Patch('/bets/:id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<IBet>,
    @Res() res: Response
  ) {
    const data = await this.betService.update(
      {
        _id: id,
      },
      body
    );
    return SuccessResponse(res, data);
  }

  @Delete('/bets/:id')
  async del(@Param('id') id: string, @Res() res: Response) {
    const data = await this.betService.permanentlyDelete(id);
    return SuccessResponse(res, data);
  }
}
