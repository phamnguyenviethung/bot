const { readdirSync } = require('fs');
const path = require('path');
const { logger } = require('../configs/logger.config');

module.exports = (client) => {
  const foldersPath = path.resolve('src/events');

  let count = 0;
  const files = readdirSync(foldersPath);
  for (const f of files) {
    if (!f.endsWith('.event.js')) continue;
    const eventName = f.substring(0, f.indexOf('.event.js'));
    const event = require(`${foldersPath}/${f}`);
    client.on(eventName, event.bind(null, client));
    count++;
  }
  logger.info(`${count} event đã sẵn sàng!`);
};
