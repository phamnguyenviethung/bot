const { SlashCommandBuilder } = require('discord.js');
const formatMoney = require('../../utils/formatMoney');
const formatCoin = require('../../utils/formatCoin');
const Location = require('../../core/models/location.model');
const User = require('../../core/models/user.model');
const _ = require('lodash');
module.exports = {
  cooldonw: 3,
  data: new SlashCommandBuilder()
    .setName('wallet')
    .setDescription('Thong tin ca nhan'),
  async run({ client, interaction, user, configService }) {
    let text = `💰 **${interaction.user.username}** hiện có: \n\n`;
    text += `- Tiền: ${formatMoney(user.money)}\n`;
    return await interaction.followUp(text);
  },
};
