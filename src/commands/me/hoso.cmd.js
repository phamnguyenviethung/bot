const { SlashCommandBuilder } = require('discord.js');
const formatMoney = require('../../utils/formatMoney');
const numeral = require('numeral');
const financeService = require('../../core/services/finance.service');
module.exports = {
  cooldonw: 3,
  data: new SlashCommandBuilder()
    .setName('hoso')
    .setDescription('Ho so cua toi'),
  async run({ client, interaction, user, configService }) {
    const percent = await financeService.calcInterestPercent(user);
    let text = `💰 **${interaction.user.username}** hiện có: \n\n`;
    text += `- Điểm công dân: **${numeral(user.point).format('0,0')}**\n`;
    text += `- Sinh lãi: **${percent}%** số tiền hiện có\n`;
    text += `\n🔴 **Lưu ý:**\n\n*Lao động để **tăng điểm** công dân và tăng sinh lãi\nĐánh bạc sẽ **giảm điểm** công dân và sinh lãi*\n\n`;

    return await interaction.followUp(text);
  },
};
