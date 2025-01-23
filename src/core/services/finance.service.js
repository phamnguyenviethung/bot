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
    return rate;
  };
  getBaseSalaryRate = async () => {
    const rate = await redis.get(this.getBaseSalaryKey());
    return rate;
  };

  init = async () => {
    await redis.set(this.getKey(), this.DEFAULT_RATE);
    await redis.set(this.getBaseSalaryKey(), this.BASE_SALARY_RATE);
    logger.info(`Fin Rate: ${this.DEFAULT_RATE.toLocaleString('en-US')}`);
    logger.info(
      `Base Salary Rate: ${this.BASE_SALARY_RATE.toLocaleString('en-US')}`
    );
  };
}

module.exports = new FinanceService();
