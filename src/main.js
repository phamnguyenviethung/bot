require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.env.dev',
});
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require('discord.js');
const botConfig = require('./configs/bot.config');
const db = require('./configs/db.config');
const { logger } = require('./configs/logger.config');
const setupData = require('./core/setupData');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [
    Partials.Message,
    Partials.User,
    Partials.Channel,
    Partials.GuildMember,
  ],
});

client.commands = new Collection();
client.interactions = new Collection();
client.cooldowns = new Collection();

require(`./handlers/command.handler`)(client);
require(`./handlers/event.handler`)(client);

const start = async () => {
  try {
    await db.connect();

    await client.login(botConfig.token);
    await client.user.setActivity('Fuck u', { type: 'WATCHING' });
    require('./core/jobs/index');

    await setupData();
  } catch (error) {
    console.error(error);
    logger.error('Failed to start the bot');
  }
};

start();
