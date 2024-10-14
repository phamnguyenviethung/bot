const { SlashCommandBuilder } = require('discord.js');
const userService = require('../../core/services/user.service');
const User = require('../../core/models/user.model');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dangky')
    .setDescription('Đăng kí tài khoản'),
  async run({ client, interaction }) {
    const user = await User.findOne({
      discordID: interaction.user.id,
    });

    if (user) {
      return await interaction.followUp('Bạn đã đăng ký rồi');
    }

    await User.create({
      discordID: interaction.user.id,
    });

    return interaction.followUp('Đăng ký thành công');
  },
};
