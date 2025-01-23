const cron = require('node-cron');
const addInterest = require('./addInterest');
const { logger } = require('../../configs/logger.config');

cron.schedule(addInterest.CRONJOB_EXPRESSION, addInterest.run);
logger.info('Loaded jobs');
