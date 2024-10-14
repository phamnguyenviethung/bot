const { SlashCommandBuilder } = require('discord.js');
const User = require('../../core/models/user.model');
const userRepo = require('../../core/repositories/user.repo');
const formatMoney = require('../../utils/formatMoney');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chuyentien')
    .setDescription('Chuyển tiền cho người khác')
    .addUserOption((option) =>
      option.setName('nguoinhan').setDescription('Người nhận').setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName('sotien')
        .setDescription('Số tiền cần chuyển')
        .setRequired(true)
        .setMinValue(1)
    ),
  async run({ client, interaction, user }) {
    const r = interaction.options.getUser('nguoinhan');
    const amount = interaction.options.getNumber('sotien');

    if (amount > user.money) {
      return await interaction.followUp(
        'Bạn không đủ tiền để thực hiện giao dịch này'
      );
    }

    const receiver = await User.findOne({
      discordID: r.id,
    });

    if (!receiver) {
      return await interaction.followUp('Người nhận không tồn tại');
    }

    if (interaction.user.id === r.id) {
      return await interaction.followUp(
        'Bạn không thể chuyển tiền cho chính mình'
      );
    }

    await userRepo.plusMoney(user.discordID, -amount);
    await userRepo.plusMoney(receiver.discordID, amount);

    await interaction.followUp(
      `💸 **${interaction.user.username}** đã chuyển ${formatMoney(
        amount
      )} tiền cho **${r.username}**`
    );
  },
};
