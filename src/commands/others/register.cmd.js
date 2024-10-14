const { SlashCommandBuilder } = require('discord.js');
const userService = require('../../core/services/user.service');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dangky')
    .setDescription('Đăng kí tài khoản'),
  async run({ client, interaction }) {
    await userService.register({
      discordID: interaction.user.id,
    });

    return interaction.followUp('Đăng ký thành công');
  },
};
