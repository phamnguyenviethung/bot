const { SlashCommandBuilder } = require('discord.js');
const formatMoney = require('../../utils/formatMoney');
const formatCoin = require('../../utils/formatCoin');
const { startGame } = require('./core/baicao.core');
const { AttachmentBuilder } = require('discord.js');
const userRepo = require('../../core/repositories/user.repo');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  cooldonw: 8,
  data: new SlashCommandBuilder()
    .setName('baicao')
    .setDescription('Đánh bài cào')
    .addNumberOption((option) =>
      option
        .setName('money')
        .setDescription('Số tiền cần cược - Nhập 0 để all in')
        .setMinValue(0)
        .setRequired(true)
    ),
  async run({ client, interaction, user }) {
    const money =
      interaction.options.getNumber('money') === 0
        ? user.money
        : interaction.options.getNumber('money');
    if (user.money <= 0 || money > user.money) {
      return interaction.followUp(`Bạn không đủ tiền để chơi`);
    }

    await userRepo.plusMoney(interaction.user.id, -money);

    const { finalCanvas, isWin, fakeCanvas1, fakeCanvas2 } = await startGame({
      username: interaction.user.username,
      money,
    });

    const fakeAtt1 = new AttachmentBuilder(fakeCanvas1, {
      name: 'baicao1.png',
    });

    const fakeAtt2 = new AttachmentBuilder(fakeCanvas2, {
      name: 'baicao2.png',
    });

    const attachment = new AttachmentBuilder(finalCanvas, {
      name: 'baicao3.png',
    });

    await interaction.followUp({
      files: [fakeAtt1],
    });

    await wait(1500);

    await interaction.editReply({
      files: [fakeAtt2],
    });
    await wait(2200);

    await interaction.editReply({
      files: [attachment],
    });
    const prize = money * 3;

    if (isWin) {
      await userRepo.plusMoney(interaction.user.id, prize);
    }

    const msg = isWin
      ? `🔥🔥 **${interaction.user.username}** đã thắng ${formatMoney(prize)}`
      : `😭😭 **${interaction.user.username}** đã bị Kaka luộc ${formatMoney(
          money
        )}`;

    await interaction.followUp(msg);
  },
};
