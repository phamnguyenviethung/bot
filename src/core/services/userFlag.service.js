const redis = require('../../configs/redis.config');
const { LOW, MEDIUM, HIGH } = require('../../constants/flag.constant');
const financeService = require('./finance.service');
const { logger } = require('../../configs/logger.config');
class UserFlagService {
  getKey = (userID) => {
    return `flag_${userID}`;
  };

  getUserFlag = async (userID) => {
    const key = this.getKey(userID);
    return await redis.hgetall(key);
  };

  setFlag = async ({ userID, prize }) => {
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
