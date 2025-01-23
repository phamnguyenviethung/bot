const { logger } = require('../../configs/logger.config');
const User = require('../models/user.model');
const _ = require('lodash');
class AddInterestJob {
  CRONJOB_EXPRESSION = '*/2 * * * *';

  run = async () => {
    try {
      logger.info('Add interest job is running');
      const rs = await User.find({
        money: { $gt: 0 },
      });
      await Promise.all(
        rs.map(async (u) => {
          const m = _.round((u.money * 5) / 100 + 100);
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
