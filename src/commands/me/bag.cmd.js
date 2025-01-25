const { SlashCommandBuilder } = require('discord.js');

const inventoryService = require('../../core/services/inventory.service');

const {
  ComponentType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require('discord.js');
const { logger } = require('../../configs/logger.config');

const buttonID = {
  prev: 'bag-prev',
  next: 'bag-next',
};

module.exports = {
  cooldonw: 3,
  data: new SlashCommandBuilder().setName('bag').setDescription('Balo cua toi'),
  async run({ client, interaction, user, configService }) {
    const data = await inventoryService.getUserInven(user._id);

    if (data.length === 0) {
      return await interaction.followUp('Balo của bạn đang trống');
    }

    let currentPage = 1;

    const genText = () => {
      const current = data[currentPage - 1];
      let typeText = `\n\n**${current.type}**\n\n`;
      current.items.forEach(({ item, quantity }) => {
        typeText += `- ${item.name} **x${quantity}** \`${item.code}\`\n`;
      });

      return typeText;
    };

    // Button
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
      content: `👜 **Balo của ${
        interaction.user.username
      }** hiện có:${genText()} \n\n`,
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
          content: `🧰** ${
            interaction.user.username
          }** hiện có:\n${genText()}\n\n`,
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
