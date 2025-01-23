const redis = require('../../configs/redis.config');
const _ = require('lodash');
class ConfigService {
  PREFIX = 'config';

  getKey = (key) => {
    return this.PREFIX + '_' + key;
  };

  setString = async (key, value) => {
    const k = this.getKey(key);

    return await redis.set(k, value);
  };

  getString = async (key, backupValue) => {
    const k = this.getKey(key);
    const v = await redis.get(k);
    if (!v) {
      await this.setString(key, backupValue);
      return backupValue;
    }

    return v;
  };

  getData = async (key, backupValue) => {
    const k = this.getKey(key);

    const data = await redis.hgetall(k);
    if (_.isEmpty(data)) {
      await this.setData(key, backupValue);
      return backupValue;
    }

    return data;
  };

  setData = async (key, data) => {
    const k = this.getKey(key);

    return await redis.hset(k, data);
  };
}

module.exports = new ConfigService();
