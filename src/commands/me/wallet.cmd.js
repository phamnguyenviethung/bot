const { SlashCommandBuilder } = require('discord.js');
const User = require('../../core/models/user.model');
const formatMoney = require('../../utils/formatMoney');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wallet')
    .setDescription('Thong tin ca nhan'),
  async run({ client, interaction, user }) {
    return await interaction.followUp(
      `💰 **${interaction.user.username}** hiện có ${formatMoney(user.money)}`
    );
  },
};
