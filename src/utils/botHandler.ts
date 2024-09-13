import { Client } from 'discordx';

const logger = require('./wsLogger');
const fs = require('fs');
const path = require('path');

class BotHandler {
  loadData(): void {
    ['commands', 'events'].forEach(folderName => {
      const commandFiles = fs
        .readdirSync(path.resolve(__dirname, `../${folderName}/`))
        .filter(f => f.endsWith('.ts'));
      for (const file of commandFiles) {
        require(`../${folderName}/${file}`);
        logger.info(`${file} loaded`);
      }
    });
  }
}

module.exports = new BotHandler();
