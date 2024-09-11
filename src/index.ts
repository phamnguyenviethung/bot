import type { CommandInteraction, Interaction } from 'discord.js';

require('dotenv').config();
const { IntentsBitField } = require('discord.js');
const { Client } = require('discordx');
const logger = require('./utils/wsLogger');
const db = require('./configs/db.config');
const botHandler = require('./utils/botHandler');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.DirectMessages,
  ],
  silent: false,
});

client.once('ready', async () => {
  logger.info('Bot da san sang');
  db.connect();
  // to create/update/delete discord application commands
  await client.initApplicationCommands();
});

client.on('interactionCreate', async (interaction: Interaction) => {
  try {
    client.executeInteraction(interaction);
  } catch (error) {
    logger.error(error);

    const cmdIneraction = interaction as CommandInteraction;
    console.log(cmdIneraction);
    await cmdIneraction.followUp('Đã có lỗi xảy ra');
  }
});

const init = async () => {
  botHandler.loadData();
  client.login(process.env.BOT_TOKEN);
};
init();

process.on('uncaughtException', function (err) {
  logger.error('Caught exception: ' + err);
});

module.exports = { init };
