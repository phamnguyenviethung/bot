const User = require('../models/user.model');

class UserRepository {
  plusMoney = async (discordID, amount) => {
    const user = await User.findOne({
      discordID,
    });

    user.money += amount;
    return await user.save();
  };
}

module.exports = new UserRepository();
