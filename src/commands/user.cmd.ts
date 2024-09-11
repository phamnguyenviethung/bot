import { CommandInteraction } from 'discord.js';
import UserService from '../core/services/user.service';

const { Discord, Slash } = require('discordx');
const BaseCMD = require('../common/base/base.cmd');
@Discord()
export class User extends BaseCMD {
  private userService: UserService = new UserService();
  @Slash({ name: 'dangky', description: 'Đăng ký tài khoản' })
  async register(interaction: CommandInteraction): Promise<void> {
    try {
      const rs = await this.userService.getAll();
      console.log(rs);
      await interaction.reply('s');
    } catch (error) {
      this.logError(error);
      await interaction.reply('Đã có lỗi xảy ra');
    }
  }
}
