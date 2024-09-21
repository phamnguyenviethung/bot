import UserService from '@/core/services/user.service';
import { CommandInteraction } from 'discord.js';

const logger = require('@utils/wsLogger');

class BaseCMD {
  private userService;

  constructor() {
    this.userService = new UserService();
  }

  async logError(
    err: Error | string | undefined = '',
    interaction: CommandInteraction
  ): Promise<void> {
    logger.error('Có lỗi xảy ra: ');
    console.error(err);
    await interaction.reply(`**${interaction.commandName}**: Đã có lỗi xảy ra`);
  }
}

module.exports = BaseCMD;
