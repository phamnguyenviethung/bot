const mongoose = require('mongoose');
const botConfig = require('./bot.config');
const { logger } = require('./logger.config');

const connect = async () => {
  try {
    await mongoose.connect(botConfig.MONGODB_URI);
    logger.info(`env: ${botConfig.env}`);
    logger.info('Ket noi database thanh cong');
  } catch (error) {
    logger.error('Ket noi database that bai');
    logger.error(error);
  }
};

module.exports = { connect };
