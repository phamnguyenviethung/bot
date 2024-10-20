const { Keyv } = require('keyv');
const botConfig = require('./bot.config');
const { default: KeyvMongo } = require('@keyv/mongo');

module.exports = new Keyv(new KeyvMongo(botConfig.MONGODB_URI));
