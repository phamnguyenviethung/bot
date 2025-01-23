const User = require('../models/user.model');
const userRepo = require('../repositories/user.repo');
const _ = require('lodash');
class UserService {
  INC_PERCENT = 1;
  DEC_PERCENT = 2;

  register = async (data) => {
    const user = await User.findOne({
      discordID: data.discordID,
    });

    if (user) {
      throw new Error('Bạn đã đăng ký rồi');
    }

    return await User.create(data);
  };

  incPointByWorking = async ({ discordID }) => {
    const user = await User.findOne({
      discordID,
    });
    if (!user) {
      throw new Error('Không tìm thấy user');
    }

    const point = _.round((user.point * this.INC_PERCENT) / 100);
    await userRepo.plusPoint(discordID, point);
  };
  decPoint = async ({ discordID }) => {
    const user = await User.findOne({
      discordID,
    });
    if (!user) {
      throw new Error('Không tìm thấy user');
    }

    let point = _.round((user.point * this.INC_PERCENT) / 100);

    if (point < 0 || point > user.point) {
      user.point = 0;
      await user.save();
    } else {
      await userRepo.plusPoint(discordID, -point);
    }
  };
}

module.exports = new UserService();
