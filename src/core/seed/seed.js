require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.env.dev',
});
const db = require('../../configs/db.config');
const { logger } = require('../../configs/logger.config');
const itemSeed = require('./item/item.seed');
const invenService = require('../services/inventory.service');
const run = async () => {
  try {
    await db.connect();

    logger.info('===== Seed Start =====');
    await invenService.addInventory({
      userID: '670d1439a7cb7160bdeee119',
      itemCode: 'Domingo Emmerich',
      quantity: -5,
    });
    logger.info('===== Seed end =====');
  } catch (error) {
    logger.error('!!==== Seed error ====!!');
    logger.error(error);
  }
};

run();
