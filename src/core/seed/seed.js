require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.env.dev',
});
const db = require('../../configs/db.config');
const { logger } = require('../../configs/logger.config');
const itemSeed = require('./item/item.seed');
const invenService = require('../services/inventory.service');
const itemService = require('../services/item.service');
const { dig } = require('../../commands/work/core/dig.core');

const test = async () => {
  try {
  } catch (error) {
    logger.log(error);
  }
};

const run = async () => {
  try {
    await db.connect();

    logger.info('===== Seed Start =====');

    logger.info('===== Seed end =====');
  } catch (error) {
    logger.error('!!==== Seed error ====!!');
    logger.error(error);
  }
};

run();
// test();
