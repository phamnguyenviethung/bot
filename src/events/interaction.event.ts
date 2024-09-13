import { ArgsOf, Client, Discord, On } from 'discordx';
const { Events } = require('discord.js');
const wsLogger = require('../utils/wsLogger');
@Discord()
export class InteractionEvent {
  @On({ event: Events.InteractionCreate })
  onMessage(
    [interaction]: ArgsOf<'interactionCreate'>, // Type message automatically
    client: Client, // Client instance injected here,
    guardPayload: any
  ) {
    try {
      if (interaction.isChatInputCommand()) {
      }
      client.executeInteraction(interaction);
    } catch (error) {
      wsLogger.error(error);
    }
  }
}
