import UserService from '@/core/services/user.service';
import { ArgsOf, Client, Discord, On } from 'discordx';
const { Events } = require('discord.js');
const wsLogger = require('../utils/wsLogger');

const whielistCMD = ['test', 'dangky'];

@Discord()
export class InteractionEvent {
  @On({ event: Events.InteractionCreate })
  async onMessage(
    [interaction]: ArgsOf<'interactionCreate'>, // Type message automatically
    client: Client // Client instance injected here,
  ) {
    try {
      const userService = new UserService();
      const user = await userService.getOne({ dID: interaction.user.id });

      if (interaction.isChatInputCommand()) {
        if (!user && !whielistCMD.includes(interaction.commandName)) {
          return await interaction.reply(
            'Bạn chưa đăng ký, hãy đăng ký trước khi sử dụng bot'
          );
        }
      }

      client.executeInteraction(interaction);
    } catch (error) {
      wsLogger.error(error);
    }
  }
}
