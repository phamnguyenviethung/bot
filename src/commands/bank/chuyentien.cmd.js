const { SlashCommandBuilder } = require('discord.js');
const User = require('../../core/models/user.model');
const userRepo = require('../../core/repositories/user.repo');
const formatMoney = require('../../utils/formatMoney');
const formatCoin = require('../../utils/formatCoin');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bank')
    .setDescription('Lệnh liên quán đến ngân hàng')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('chuyentien')
        .setDescription('Chuyển tiền cho người khác')
        .addStringOption((option) =>
          option
            .setName('loaitien')
            .setDescription('Loại tiền')
            .setRequired(true)
            .addChoices([
              {
                name: 'Tiền',
                value: 'money',
              },
              {
                name: 'Coin',
                value: 'coin',
              },
            ])
        )
        .addUserOption((option) =>
          option
            .setName('nguoinhan')
            .setDescription('Người nhận')
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName('sotien')
            .setDescription('Số tiền cần chuyển')
            .setRequired(true)
            .setMinValue(1)
        )
    ),
  async run({ client, interaction, user }) {
    const r = interaction.options.getUser('nguoinhan');
    const type = interaction.options.getString('loaitien');
    const amount = interaction.options.getNumber('sotien');

    const userBalnaceType = type === 'money' ? user.money : user.coin;

    if (amount > userBalnaceType) {
      return await interaction.followUp(
        'Bạn không đủ tiền hoặc coin để thực hiện giao dịch này'
      );
    }

    const receiver = await User.findOne({
      discordID: r.id,
    });

    if (!receiver) {
      return await interaction.followUp('Người nhận chưa đăng ký tài khoản');
    }

    if (interaction.user.id === r.id) {
      return await interaction.followUp(
        'Bạn không thể chuyển tiền cho chính mình'
      );
    }

    if (type === 'money') {
      await userRepo.plusMoney(user.discordID, -amount);
      await userRepo.plusMoney(receiver.discordID, amount);

      client.users.fetch(r.id).then((u) => {
        u.send(
          `💳  Bạn vừa nhận được ${formatMoney(amount)} tiền từ **${
            interaction.user.username
          }**`
        );
      });

      await interaction.followUp(
        `💸 **${interaction.user.username}** đã chuyển ${formatMoney(
          amount
        )} tiền cho **${r.username}**`
      );
    } else {
      await userRepo.plusCoin(user.discordID, -amount);
      await userRepo.plusCoin(receiver.discordID, amount);

      client.users.fetch(r.id).then((u) => {
        u.send(
          `💳  Bạn vừa nhận được ${formatCoin(amount)} từ **${
            interaction.user.username
          }**`
        );
      });

      await interaction.followUp(
        `💸 **${interaction.user.username}** đã chuyển ${formatCoin(
          amount
        )} cho **${r.username}**`
      );
    }
  },
};
