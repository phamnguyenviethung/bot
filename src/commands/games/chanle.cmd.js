const { SlashCommandBuilder } = require('discord.js');
const _ = require('lodash');
const userRepo = require('../../core/repositories/user.repo');
const formatMoney = require('../../utils/formatMoney');
const choices = [
  {
    name: 'Chẵn',
    value: '7',
  },
  {
    name: 'Lẻ',
    value: '8',
  },
];

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('chanle')
    .setDescription('Chẵn lẻ')
    .addNumberOption((option) =>
      option
        .setName('money')
        .setDescription('Nhập số tiền cược')
        .setRequired(true)
        .setMinValue(0)
    )
    .addStringOption((option) =>
      option
        .setName('so')
        .setDescription('Chọn chẵn/lẻ')
        .setRequired(true)
        .addChoices(...choices)
    ),
  async run({ client, interaction, user }) {
    const moneyInput = interaction.options.getNumber('money');
    const money = moneyInput === 0 ? user.money : moneyInput;
    const n = interaction.options.getString('so');
    const guessNumber = n * 1;

    if (money > user.money || user.money <= 0) {
      return await interaction.followUp('Bạn không đủ tiền');
    }

    const latestWinPrize = _.round(user.latestWinPrize / 2);
    if (money < latestWinPrize && user.latestWinPrize > 0) {
      return await interaction.followUp(
        `Theo luật, bạn cần ít nhất cược vào  ${formatMoney(
          latestWinPrize
        )} (50% tiền ăn được ván trước) để chơi tiếp`
      );
    }
    await userRepo.plusMoney(user.discordID, -money);

    const randomNumber = _.random(1, 4);
    const isOdd = randomNumber % 2 !== 0;

    let isWin = (isOdd && guessNumber === 8) || (!isOdd && guessNumber === 7);
    let prize = money * 2;

    if (isWin) {
      user.latestWinPrize = prize - money;
      await user.save();
    }

    await interaction.followUp(
      `**${interaction.user.username}** đã ${
        moneyInput === 0 ? 'all in' : 'cược'
      } ${formatMoney(money)} để dự đoán số là **${
        guessNumber === 7 ? 'Chẵn' : 'lẻ'
      }**`
    );
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });

    if (isWin) {
      await userRepo.plusMoney(user.discordID, prize);
      return await interaction.followUp(
        `🔥🔥🔥 Kết quả là **${randomNumber}** - Chúc mừng **${
          interaction.user.username
        }** đã thắng và nhận được ${formatMoney(prize)}`
      );
    } else {
      user.latestWinPrize = 0;
      await user.save();
      return await interaction.followUp(
        `💩💩💩 Kết quả là **${randomNumber}** - Ngài **${
          interaction.user.username
        }** đã mất ${formatMoney(money)}`
      );
    }
  },
};
