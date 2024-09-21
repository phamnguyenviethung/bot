import UserService from '@/core/services/user.service';
import {
  JsonController,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
} from 'routing-controllers';

@JsonController()
export class UserController {
  private readonly userService = new UserService();

  @Get('/users')
  async getAll() {
    const users = await this.userService.getAll();
    return {
      data: users,
      message: 'ok',
    };
  }

  @Get('/users/:id')
  async getByID(@Param('id') id: string) {
    const users = await this.userService.getByID(id);
    return {
      data: users,
      message: 'ok',
    };
  }
}
