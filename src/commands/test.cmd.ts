const { CommandInteraction } = require('discord.js');
const { Discord, Slash } = require('discordx');
const BaseCMD = require('../common/base/Base.cmd');
@Discord()
export class Test extends BaseCMD {
  @Slash({ name: 'test', description: 'Test command' })
  async test(interaction: typeof CommandInteraction): Promise<void> {
    interaction.reply({ content: 'Test command' });
  }
}
