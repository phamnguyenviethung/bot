const { readdirSync } = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const botConfig = require('../configs/bot.config');
const commandsArray = [];
const path = require('path');
const { logger } = require('../configs/logger.config');

module.exports = (client) => {
  const foldersPath = path.resolve('src/commands');

  let count = 0;
  let lockedCmd = 0;
  readdirSync(foldersPath).forEach((dir) => {
    const commands = readdirSync(`${foldersPath}/${dir}`).filter((file) =>
      file.endsWith('.cmd.js')
    );
    for (const file of commands) {
      const pull = require(`${foldersPath}/${dir}/${file}`);
      if (pull.data.name && !pull.isLocked) {
        client.interactions.set(pull.data.name, pull);
        commandsArray.push(pull.data.toJSON());
        count++;
      } else {
        lockedCmd++;
        continue;
      }
    }
  });

  const rest = new REST().setToken(botConfig.token);
  const clientId = botConfig.clientID;
  client.once('ready', async () => {
    await rest.put(Routes.applicationCommands(clientId), {
      body: commandsArray,
    });
    logger.info(`${count} lệnh đã sẵn sàng`);
    logger.info(`${lockedCmd} lệnh đã bị vô hiệu hóa`);
  });
};
