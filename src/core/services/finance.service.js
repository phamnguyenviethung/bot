const redis = require('../../configs/redis.config');
const { logger } = require('../../configs/logger.config');
class FinanceService {
  DEFAULT_RATE = 1000000;

  getKey = () => {
    return `fin`;
  };

  getRate = async () => {
    const rate = await redis.get(this.getKey());
    return rate;
  };

  initFinanceRate = async () => {
    await redis.set(this.getKey(), this.DEFAULT_RATE);
    logger.info(
      `Init finance rate: ${this.DEFAULT_RATE.toLocaleString('en-US')}`
    );
  };
}

module.exports = new FinanceService();
