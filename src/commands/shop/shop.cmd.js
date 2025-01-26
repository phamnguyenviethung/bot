const {
  SlashCommandBuilder,
  ComponentType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require('discord.js');
const userRepo = require('../../core/repositories/user.repo');
const _ = require('lodash');
const formatMoney = require('../../utils/formatMoney');
const userService = require('../../core/services/user.service');
const itemService = require('../../core/services/item.service');
const { logger } = require('../../configs/logger.config');

const buttonID = {
  prev: 'shop-prev',
  next: 'shop-next',
};

const TAPHOA = 'taphoa';
const CHODEN = 'choden';

const locations = [
  {
    name: 'Tạp hoá',
    value: TAPHOA,
  },
  {
    name: 'Chợ đen',
    value: CHODEN,
  },
];

module.exports = {
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('Đi chợ mua đồ')
    .addStringOption((opt) =>
      opt
        .setName('vitri')
        .setDescription('Chọn vị trí')
        .setRequired(true)
        .addChoices(...locations)
    ),
  async run({ client, interaction, rate, user }) {
    const n = interaction.options.getString('vitri');

    const data = await itemService.getGroupItemByTags(n);

    if (data.length === 0) {
      return await interaction.followUp('Không có hàng');
    }

    let currentPage = 1;

    const genText = () => {
      const current = data[currentPage - 1];
      let typeText = `\n\n**${current.type}**\n\n`;
      current.items.forEach((item) => {
        typeText += `- ${item.name}: ${formatMoney(item.price)} \`${
          item.code
        }\`\n`;
      });

      return typeText;
    };
    const prevButton = new ButtonBuilder()
      .setCustomId(buttonID.prev)
      .setLabel('Lùi')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(currentPage === 1);

    const nextButton = new ButtonBuilder()
      .setCustomId(buttonID.next)
      .setLabel('Tiếp')
      .setStyle(ButtonStyle.Success)
      .setDisabled(data.length === 1 || currentPage === data.length);

    const row = new ActionRowBuilder().addComponents(prevButton, nextButton);

    const reply = await interaction.followUp({
      content: `${genText()} \n\n`,
      components: [row],
    });
    const filter = (i) => i.user.id === interaction.user.id;

    const collector = reply.createMessageComponentCollector({
      filter,
      componentType: ComponentType.Button,
      time: 60 * 1000,
      max: 60,
    });

    collector.on('collect', async (i) => {
      try {
        await i.deferUpdate();

        if (i.customId === buttonID.prev) {
          currentPage -= 1;
        } else {
          currentPage += 1;
        }

        await prevButton.setDisabled(currentPage === 1);
        await nextButton.setDisabled(
          currentPage === data.length || data.length === 1
        );

        return await interaction.editReply({
          content: `${genText()}\n\n`,
          components: [row],
        });
      } catch (error) {
        logger.error(error);
        await interaction.editReply({
          content: 'Có lỗi rồi sir',
          components: [],
        });
      }
    });
  },
};
