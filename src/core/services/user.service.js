const User = require('../models/user.model');

class UserService {
  register = async (data) => {
    const user = await User.findOne({
      discordID: data.discordID,
    });

    if (user) {
      throw new Error('Bạn đã đăng ký rồi');
    }

    return await User.create(data);
  };
}

module.exports = new UserService();
