const { SlashCommandBuilder } = require('discord.js');
const formatMoney = require('../../utils/formatMoney');
const formatCoin = require('../../utils/formatCoin');

module.exports = {
  cooldonw: 3,
  data: new SlashCommandBuilder()
    .setName('wallet')
    .setDescription('Thong tin ca nhan'),
  async run({ client, interaction, user }) {
    let text = `💰 **${interaction.user.username}** hiện có: \n\n`;
    text += `- Tiền: ${formatMoney(user.money)}\n`;
    text += `- Coin: ${formatCoin(user.coin)}\n`;
    return await interaction.followUp(text);
  },
};
