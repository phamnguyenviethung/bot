const {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
} = require('discord.js');

const User = require('../../core/models/user.model');
const { calcBetData } = require('./core/coinflip.core');
const _ = require('lodash');
const userRepo = require('../../core/repositories/user.repo');
const formatMoney = require('../../utils/formatMoney');

const buttonID = {
  heads: 'Heads',
  tails: 'Tails',
};

const generateChoiceText = (playerList) => {
  const [h, t] = _.partition(playerList, { choice: buttonID.heads });
  const hNameList = h.map((p) => `*${p.username}*`);
  const tNameList = t.map((p) => `*${p.username}*`);
  let text = '';
  text += `**Heads:** ${hNameList.join(', ')}\n\n`;
  text += `**Tails:** ${tNameList.join(', ')}\n\n`;

  return text;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Solo coinflip với anh em')
    .addNumberOption((option) =>
      option
        .setName('amount')
        .setDescription('Số tiền cược')
        .setRequired(true)
        .setMinValue(5000)
    )
    .addNumberOption((option) =>
      option
        .setName('time')
        .setDescription('Thời gian đợi cược (10 - 30 giây)')
        .setMinValue(10)
        .setMaxValue(30)
    ),
  async run({ client, interaction, user }) {
    const amount = interaction.options.getNumber('amount');
    const time = interaction.options.getNumber('time') || 10;
    const randomChoice =
      _.random(100) % 2 === 0 ? buttonID.heads : buttonID.tails;

    // Button
    const headButton = new ButtonBuilder()
      .setCustomId(buttonID.heads)
      .setLabel('Heads')
      .setStyle(ButtonStyle.Success);

    const tailButton = new ButtonBuilder()
      .setCustomId(buttonID.tails)
      .setLabel('Tails')
      .setStyle(ButtonStyle.Danger);
    const row = new ActionRowBuilder().addComponents(headButton, tailButton);

    const playerList = [];

    const generateContent = () => {
      const { totalPlayer, totalBet } = calcBetData({
        playerList,
        amount,
        choice: randomChoice,
      });

      return `💶 ** ${
        interaction.user.username
      }**  đã mở sòng coinflip với giá ${formatMoney(
        amount
      )}\n\nTổng người chơi: **${totalPlayer}**\nTổng tiền bet: ${formatMoney(
        totalBet
      )}\n\n${generateChoiceText(playerList)}`;
    };
    const reply = await interaction.followUp({
      content: generateContent(),
      components: [row],
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: time * 1000,
      max: 100,
    });

    collector.on('collect', async (i) => {
      try {
        await i.deferUpdate();

        const isIn = playerList.some((p) => p.userID === i.user.id);

        if (isIn) {
          return i.followUp({
            content: 'Bạn đã cược rồi',
            ephemeral: true,
          });
        }

        const player = await User.findOne({ discordID: i.user.id });
        if (!player) {
          return i.followUp({
            content: 'Bạn chưa đăng ký tài khoản',
            ephemeral: true,
          });
        }

        if (player.money < amount) {
          return i.followUp({
            content: 'Bạn không đủ tiền để cược',
            ephemeral: true,
          });
        }

        await userRepo.plusMoney(i.user.id, -amount);

        await interaction.followUp(
          `**${i.user.username}** đã bet ${formatMoney(amount)} vào **${
            i.customId
          }**`
        );

        playerList.push({
          userID: i.user.id,
          username: i.user.username,
          choice: i.customId,
        });

        return await reply.edit({
          content: generateContent(),
          components: [row],
        });
      } catch (error) {
        logger.error(error);
      }
    });

    collector.on('end', async (collected) => {
      await reply.edit({
        content: generateContent(),
        components: [],
      });

      const { totalBet, totalPlayer, winnerList, lostList } = calcBetData({
        playerList,
        amount,
        choice: randomChoice,
      });

      if (totalPlayer <= 1) {
        await userRepo.plusMoney(user.discordID, amount * totalPlayer);
        return interaction.followUp({
          content: 'Không đủ người chơi. Bạn sẽ được hoàn trả tiền',
        });
      }

      if (winnerList.length === 0 || lostList.length === 0) {
        let list = winnerList.length === 0 ? lostList : winnerList;

        await Promise.all(
          list.map((p) => userRepo.plusMoney(p.userID, amount * totalPlayer))
        );

        return interaction.followUp({
          content: 'Không có người thắng hoặc thua. Bạn sẽ được hoàn trả tiền',
        });
      }

      const prize = _.round(totalBet / winnerList.length);

      await Promise.all(
        winnerList.map((p) => userRepo.plusMoney(p.userID, prize))
      );

      return interaction.followUp({
        content: `Kết quả: **${randomChoice}**. Người chiến thằng sẽ nhận được ${formatMoney(
          prize - amount
        )}`,
      });
    });
  },
};
