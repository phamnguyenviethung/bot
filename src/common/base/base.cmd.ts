const logger = require('../../utils/wsLogger');

class BaseCMD {
  constructor() {}

  logError(err: Error | string | undefined = ''): void {
    logger.error('Có lỗi xảy ra: ' + err);
  }
}

module.exports = BaseCMD;
