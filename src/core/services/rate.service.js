const rateConstant = require('../../constants/rate.constant');
const User = require('../models/user.model');
const keyV = require('../../configs/keyv.config');
const _ = require('lodash');
const { logger } = require('../../configs/logger.config');
const KEY = 'economicRate';

class RateService {
  getTotalMoneyAndCoin = async () => {
    const result = await User.aggregate([
      {
        $group: {
          _id: null,
          totalMoney: { $sum: '$money' },
          totalCoin: { $sum: '$coin' },
        },
      },
    ]);

    return result.length > 0 ? result[0] : { totalMoney: 0, totalCoin: 0 };
  };

  calcMainRate = async () => {
    const { totalCoin, totalMoney } = await this.getTotalMoneyAndCoin();

    if (totalMoney > 3 * 1000000000) {
      return rateConstant.EXTREMELY_HIGH;
    } else if (totalMoney > 2 * 1000000000) {
      return rateConstant.VERY_HIGH;
    } else if (totalMoney > 1 * 1000000000) {
      return rateConstant.HIGH;
    } else {
      return totalCoin >= 10 * 1000 ? rateConstant.MEDIUM : rateConstant.LOW;
    }
  };

  checkCanSellCoin = async (mainRate) => {
    const { totalCoin, totalMoney } = await this.getTotalMoneyAndCoin();

    if (totalCoin < 5000) {
      return true;
    }

    if (totalMoney < 3 * 1000000) {
      return true;
    }

    if ([rateConstant.LOW, rateConstant.MEDIUM].includes(mainRate)) {
      return true;
    }

    return false;
  };

  getEconomicRate = async () => {
    const main = await this.calcMainRate();
    const canSellCoin = await this.checkCanSellCoin(main);

    return {
      main,
      canSellCoin,
    };
  };

  setCacheRate = async () => {
    const rate = await this.getEconomicRate();

    const minutes = _.random(8, 20);
    const data = {
      ...rate,
      minutes,
    };
    await keyV.set(KEY, data, minutes);
    logger.info('Set new cache rate');
    return data;
  };

  getCacheRate = async () => {
    const cache = await keyV.get(KEY);

    if (!cache) {
      return await this.setCacheRate();
    }

    return cache;
  };
}

module.exports = new RateService();
