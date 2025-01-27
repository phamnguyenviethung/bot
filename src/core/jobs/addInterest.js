const { logger } = require('../../configs/logger.config');
const User = require('../models/user.model');
const _ = require('lodash');
const financeService = require('../services/finance.service');
class AddInterestJob {
  CRONJOB_EXPRESSION = '*/20 * * * *';

  run = async () => {
    try {
      logger.info('Add interest job is running');
      const rs = await User.find({
        money: { $gt: 0 },
      });
      await Promise.all(
        rs.map(async (u) => {
          const percent = await financeService.calcInterestPercent(u);

          const m = _.round(u.money * (percent / 100));
          return await User.findOneAndUpdate(
            {
              discordID: u.discordID,
            },
            {
              $inc: {
                money: m,
              },
            }
          );
        })
      );
      logger.info(`Add interest job is done: ${rs.length}`);
    } catch (error) {
      logger.error('AddInterestJob:', error);
    }
  };
}

module.exports = new AddInterestJob();
