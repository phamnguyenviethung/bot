const { SlashCommandBuilder } = require('discord.js');
const _ = require('underscore');
const wait = require('node:timers/promises').setTimeout;
const {
  rollData,
  generateRollAwardText,
  getRollResult,
} = require('./core/roll.core');
const userRepo = require('../../core/repositories/user.repo');
const formatMoney = require('../../utils/formatMoney');
const userService = require('../../core/services/user.service');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('games')
    .setDescription('Roll game Slot 777')
    .addSubcommand((subcommand) =>
      subcommand.setName('huongdan').setDescription('Xem huong dan')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('bet')
        .setDescription('Roll game Slot 777')
        .addNumberOption((option) =>
          option
            .setName('money')
            .setDescription('Số tiền cần cược - Nhập 0 để all in')
            .setMinValue(0)
            .setRequired(true)
        )
    ),
  cooldown: 8,
  async run({ client, interaction, user }) {
    if (interaction.options.getSubcommand() === 'huongdan') {
      const prizeTableText =
        generateRollAwardText() +
        `\n\n❓**Tiền nhận được  = Tiền đặt cược * n** (với n được tra theo bảng trên)`;

      return await interaction.followUp(prizeTableText);
    }

    const money =
      interaction.options.getNumber('money') === 0
        ? user.money
        : interaction.options.getNumber('money');

    if (user.money <= 0 || money > user.money) {
      return interaction.followUp(`Bạn không đủ tiền để chơi`);
    }

    const finalResult = getRollResult();

    const result = [
      {
        name: '❓',
        value: null,
      },
      {
        name: '❓',
        value: null,
      },
      {
        name: '❓',
        value: null,
      },
    ];

    await userRepo.plusMoney(interaction.user.id, -money);

    await interaction.followUp(result.map((item) => item.name).join('  '));
    const indexArray = _.shuffle([0, 1, 2]);

    async function updateResultText() {
      await interaction.editReply(result.map((item) => item.name).join('  '));
    }

    result[indexArray.pop()] = finalResult[0];
    await wait(1500);
    await updateResultText();
    result[indexArray.pop()] = finalResult[1];
    await wait(1800);
    await updateResultText();
    result[indexArray.pop()] = finalResult[2];
    await wait(2100);
    await updateResultText();

    const typeList = _.uniq(result.map((item) => item.name));
    const [first, second] = result;

    const isLost =
      typeList.length > 2 ||
      (result[0].name === result[2].name && typeList.length === 2);

    if (isLost) {
      await interaction.followUp(
        `\n\n😧 **${interaction.user.username}** đã mất ${formatMoney(money)}`
      );
    } else {
      let prize = 0;
      const isTriple = typeList.length === 1 ? 1 : 0;

      if (isTriple) {
        prize =
          rollData.find((item) => item.name === typeList[0]).value[1] * money;
      } else {
        prize =
          (first.name === second.name
            ? rollData.find((item) => item.name === first.name).value[0]
            : rollData.find((item) => item.name === second.name).value[0]) *
          money;
      }

      if (prize === 0) {
        await interaction.followUp(
          `\n\n💀**${interaction.user.username}** đã roll dính ô mất hết tiền\n\n`
        );
      } else {
        await userRepo.plusMoney(interaction.user.id, prize);

        await interaction.followUp(
          `\n\n❤️‍🔥 **${interaction.user.username}** vừa nhận được ${formatMoney(
            prize
          )}\n\n `
        );
      }
    }

    await userService.decPoint({ discordID: interaction.user.id });
  },
};
