const redis = require('../../configs/redis.config');
const { logger } = require('../../configs/logger.config');
class FinanceService {
  DEFAULT_RATE = 1000000;
  BASE_SALARY_RATE = 1500;

  getKey = () => {
    return `fin`;
  };

  getBaseSalaryKey = () => {
    return `fin_baseSalary`;
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
      await redis.set(this.getKey(), this.BASE_SALARY_RATE);

      return this.BASE_SALARY_RATE;
    }
    return rate;
  };
}

module.exports = new FinanceService();
