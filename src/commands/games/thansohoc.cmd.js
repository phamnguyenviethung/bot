const { SlashCommandBuilder } = require('discord.js');
const _ = require('lodash');
const userRepo = require('../../core/repositories/user.repo');
const formatCoin = require('../../utils/formatCoin');
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

[1, 2, 3, 4].forEach((i) => {
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
        .setName('socoin')
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
    const coinInput = interaction.options.getNumber('socoin');
    const coin = coinInput === 0 ? user.coin : coinInput;
    const n = interaction.options.getString('so');
    const guessNumber = n * 1;

    if (coin > user.coin || user.coin <= 0) {
      return await interaction.followUp('Bạn không đủ tiền');
    }

    const latestWinPrize = _.round(user.latestWinPrize / 2);
    if (coin < latestWinPrize && user.latestWinPrize > 0) {
      return await interaction.followUp(
        `Theo luật, bạn cần ít nhất cược vào  ${formatCoin(
          latestWinPrize
        )} (50% coin ăn được ván trước) để chơi tiếp`
      );
    }
    await userRepo.plusCoin(user.discordID, -coin);

    const randomNumber = _.random(1, 4);
    const isOdd = randomNumber % 2 !== 0;

    let isWin = false;
    let prize = 0;

    if (n > 6) {
      isWin = (isOdd && guessNumber === 8) || (!isOdd && guessNumber === 7);
      if (isWin) {
        prize = coin * 3;

        user.latestWinPrize = prize - coin;
        await user.save();
      }
    } else {
      isWin = guessNumber === randomNumber;
      if (isWin) {
        prize = coin * 8;

        user.latestWinPrize = prize - coin;
        await user.save();
      }
    }
    await interaction.followUp(
      `**${interaction.user.username}** đã ${
        coinInput === 0 ? 'all in' : 'cược'
      } ${formatCoin(coin)} để dự đoán số là **${
        guessNumber === 7 ? 'Chẵn' : guessNumber === 8 ? 'Lẻ' : guessNumber
      }**`
    );
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });

    if (isWin) {
      await userRepo.plusCoin(user.discordID, prize);
      return await interaction.followUp(
        `🔥🔥🔥 Kết quả là **${randomNumber}** - Chúc mừng **${
          interaction.user.username
        }** đã thắng và nhận được ${formatCoin(prize)}`
      );
    } else {
      user.latestWinPrize = 0;
      await user.save();
      return await interaction.followUp(
        `💩💩💩 Kết quả là **${randomNumber}** - Ngài **${
          interaction.user.username
        }** đã mất ${formatCoin(coin)}`
      );
    }
  },
};
