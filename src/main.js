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
const financeService = require('./core/services/finance.service');
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

db.connect();

client.commands = new Collection();
client.interactions = new Collection();
client.cooldowns = new Collection();

require(`./handlers/command.handler`)(client);
require(`./handlers/event.handler`)(client);

financeService.initFinanceRate();
client.login(botConfig.token);
