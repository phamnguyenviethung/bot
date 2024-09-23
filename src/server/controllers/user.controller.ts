import { IUser } from '@/core/models/user.model';
import UserService from '@/core/services/user.service';
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
export class UserController {
  private userService;

  constructor() {
    this.userService = new UserService();
  }

  @Get('/users')
  async getAll(@Res() res: Response) {
    const data = await this.userService.getAll();
    return SuccessResponse(res, data);
  }

  @Get('/users/:id')
  async getByID(@Param('id') id: string, @Res() res: Response) {
    const data = await this.userService.getByID(id);

    return SuccessResponse(res, data);
  }

  @Post('/users')
  async create(@Body() body: Partial<IUser>, @Res() res: Response) {
    const data = await this.userService.create(body);
    return SuccessResponse(res, data);
  }

  @Patch('/users/:id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<IUser>,
    @Res() res: Response
  ) {
    const data = await this.userService.update(
      {
        _id: id,
      },
      body
    );
    return SuccessResponse(res, data);
  }

  @Delete('/users/:id')
  async del(@Param('id') id: string, @Res() res: Response) {
    const data = await this.userService.permanentlyDelete(id);
    return SuccessResponse(res, data);
  }
}
