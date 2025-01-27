const redis = require('../../configs/redis.config');
const _ = require('lodash');
class FinanceService {
  DEFAULT_RATE = 1000000;
  BASE_SALARY_RATE = 2500;

  constructor() {
    this.BASE_SALARY_RATE =
      this.DEFAULT_RATE / 100000 < 2500
        ? 2500
        : _.round(this.DEFAULT_RATE / 100000);
  }

  getKey = () => {
    return `fin`;
  };

  getBaseSalaryKey = () => {
    return `fin_baseSalary`;
  };

  getUserInterestPencenKey = (discordID) => {
    return `fin_userInterest_${discordID}`;
  };

  getFinRate = async () => {
    const rate = await redis.get(this.getKey());
    if (!rate) {
      await redis.set(this.getKey(), this.DEFAULT_RATE);

      return this.DEFAULT_RATE;
    }
    return rate;
  };
  getBaseSalaryRate = async () => {
    const rate = await redis.get(this.getBaseSalaryKey());
    if (!rate) {
      await redis.set(this.getBaseSalaryKey(), this.BASE_SALARY_RATE);

      return this.BASE_SALARY_RATE;
    }
    return rate;
  };

  calcInterestPercent = async (user) => {
    const key = this.getUserInterestPencenKey(user.discordID);
    const rate = await redis.get(key);
    if (!rate) {
      let result = 0;
      const rate = await this.getFinRate();
      result += user.money > _.round(rate / 3) ? 0 : 1;
      result += user.point >= 800 ? 3 : 2;

      await redis.set(key, String(result));
      await redis.expire(key, 600);
      return result;
    }
    return Number(rate);
  };
}

module.exports = new FinanceService();
