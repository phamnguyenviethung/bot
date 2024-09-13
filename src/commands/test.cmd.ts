import { RateLimit, TIME_UNIT } from '@discordx/utilities';
import { Guard } from 'discordx';

const { CommandInteraction } = require('discord.js');
const { Discord, Slash } = require('discordx');
const BaseCMD = require('../common/base/Base.cmd');
@Discord()
export class Hi {
  @Slash({ name: 's', description: 'Test command' })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      message: 'Đợi tí đê **(30s)**',
    })
  )
  async test(interaction: typeof CommandInteraction): Promise<void> {
    interaction.reply({ content: 'Test command' });
  }
}

@Discord()
export class Test extends BaseCMD {
  @Slash({ name: 'test', description: 'Test command' })
  @Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
      message: 'Đợi tí đê **(30s)**',
    })
  )
  async test(interaction: typeof CommandInteraction): Promise<void> {
    interaction.reply({ content: 'Test command' });
  }
}
