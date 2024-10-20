const keyVConfig = require('../../configs/keyv.config');
const BotError = require('../../utils/BotError');
const vietnamTime = require('../../utils/time');

class StatusService {
  setJailToUser = async ({ userID, minutes }) => {
    const time = vietnamTime().add(minutes, 'minutes').valueOf();

    const a = await keyVConfig.set(`jail_${userID}`, time);

    return a;
  };

  checkTimeJail = async (userID) => {
    const time = await keyVConfig.get(`jail_${userID}`);

    const isAfter = vietnamTime().isAfter(time);

    if (time && !isAfter) {
      throw new BotError(
        `🔐 Bạn đang bị tù và thời gian được hoà nhập lại xã hội là **${vietnamTime(
          time
        ).format('HH:mm:ss')}**`
      );
    }
  };
}

module.exports = new StatusService();
