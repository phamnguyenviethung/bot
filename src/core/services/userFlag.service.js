const redis = require('../../configs/redis.config');
const flagConstanst = require('../../constants/flag.constant');
const financeService = require('./finance.service');
const { logger } = require('../../configs/logger.config');
const configService = require('./config.service');
class UserFlagService {
  getKey = (userID) => {
    return `flag_${userID}`;
  };

  getUserFlag = async (userID) => {
    const key = this.getKey(userID);
    return await redis.hgetall(key);
  };

  setFlag = async ({ userID, prize }) => {
    const { LOW, MEDIUM, HIGH } = await configService.getData(
      'flagData',
      flagConstanst
    );

    const finRate = await financeService.getFinRate();
    const money = prize / finRate;

    if (money >= LOW.minMoneyToApplyRate) {
      const key = this.getKey(userID);
      let flag =
        money >= HIGH.minMoneyToApplyRate
          ? HIGH
          : money >= LOW.minMoneyToApplyRate &&
            money < MEDIUM.minMoneyToApplyRate
          ? LOW
          : MEDIUM;

      await redis.hset(key, flag);
      await redis.expire(key, flag.ttl);
      logger.info(`Set flag for ${userID} - ${flag.name}`);
    }
  };
}

module.exports = new UserFlagService();
