import { Client } from 'discordx';

const { CommandInteraction } = require('discord.js');
const { Discord, Slash } = require('discordx');
const BaseCMD = require('../common/base/Base.cmd');

@Discord()
export class Test extends BaseCMD {
  @Slash({ name: 'test', description: 'Var chạm đi' })
  async test(
    interaction: typeof CommandInteraction,
    client: Client,
    guardPayload: any
  ): Promise<void> {
    try {
      const rs = await this.userService.getAll();
      console.log(rs);
      await interaction.reply('hi');
    } catch (error) {
      this.logError(error);
      await interaction.reply('Có lỗi');
    }
  }
}
