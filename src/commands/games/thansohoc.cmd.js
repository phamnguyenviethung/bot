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

[1, 2, 3, 4, 5, 6].forEach((i) => {
  choices.push({
    name: `${i}`,
    value: String(i),
  });
});
module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('thansohoc')
    .setDescription('Thần số học')
    .addNumberOption((option) =>
      option
        .setName('sotien')
        .setDescription('Nhập số tiền cược')
        .setRequired(true)
        .setMinValue(0)
    )
    .addStringOption((option) =>
      option
        .setName('so')
        .setDescription('Chọn chẵn/lẻ hoặc dự đoán số')
        .setRequired(true)
        .addChoices(...choices)
    ),
  async run({ client, interaction, user }) {
    const moneyInput = interaction.options.getNumber('sotien');
    const money = moneyInput === 0 ? user.money : moneyInput;
    const n = interaction.options.getString('so');
    const guessNumber = n * 1;

    if (money > user.money || user.money <= 0) {
      return await interaction.followUp('Bạn không đủ tiền');
    }

    await userRepo.plusMoney(user.discordID, -money);

    const randomNumber = _.random(1, 6);
    const isOdd = randomNumber % 2 !== 0;

    let isWin = false;
    let prize = 0;

    if (n > 6) {
      isWin = (isOdd && guessNumber === 8) || (!isOdd && guessNumber === 7);
      if (isWin) prize = money * 2;
    } else {
      isWin = guessNumber === randomNumber;
      if (isWin) prize = money * 3;
    }
    await interaction.followUp(
      `**${interaction.user.username}** đã ${
        moneyInput === 0 ? 'all in' : 'cược'
      } **${formatMoney(money)}** để dự đoán số là **${
        guessNumber === 7 ? 'Chẵn' : guessNumber === 8 ? 'Lẻ' : guessNumber
      }**`
    );
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });

    if (isWin) {
      await userRepo.plusMoney(user.discordID, prize);
      return await interaction.followUp(
        `🔥🔥🔥 Kết quả là **${randomNumber}** - Chúc mừng **${
          interaction.user.username
        }** đã thắng và nhận được ${formatMoney(prize)}`
      );
    } else {
      return await interaction.followUp(
        `💩💩💩 Kết quả là **${randomNumber}** - Ngài **${
          interaction.user.username
        }** đã mất ${formatMoney(money)}`
      );
    }
  },
};
