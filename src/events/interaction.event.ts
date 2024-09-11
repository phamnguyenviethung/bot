import { ArgsOf, Client, Discord, On } from 'discordx';
const { Events } = require('discord.js');

@Discord()
export class InteractionEvent {
  @On({ event: Events.InteractionCreate })
  onMessage(
    [interaction]: ArgsOf<'interactionCreate'>, // Type message automatically
    client: Client, // Client instance injected here,
    guardPayload: any
  ) {
    console.log(interaction);
  }
}
