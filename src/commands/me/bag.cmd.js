const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require('discord.js');
const inventoryService = require('../../core/services/inventory.service');
const { logger } = require('../../configs/logger.config');

const buttonID = {
  prev: 'bag-prev',
  next: 'bag-next',
};

const generateBagText = ({ data, itemType }) => {
  let result = `\n==========\n**${itemType.toUpperCase()}**:\n==========\n`;

  data.forEach((item) => {
    result += `- **${item.name}**: ${item.quantity}\n`;
  });

  return result;
};

module.exports = {
  data: new SlashCommandBuilder().setName('bag').setDescription('Kho đồ'),
  async run({ client, interaction, user }) {
    const inven = await inventoryService.getInvenByUserID(user._id);

    if (!inven) {
      return await interaction.reply(`Bị gì rồi sir, hãy bão Hack`);
    }

    let currentPage = 1;

    const generateText = () => {
      console.log(currentPage);
      const currentBagData = inven[currentPage - 1];
      let text = generateBagText({
        itemType: currentBagData.itemType,
        data: currentBagData.itemData,
      });

      return text;
    };

    const text = generateText();

    // Button
    const prevButton = new ButtonBuilder()
      .setCustomId(buttonID.prev)
      .setLabel('Lùi')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(currentPage === 1);

    const nextButton = new ButtonBuilder()
      .setCustomId(buttonID.next)
      .setLabel('Tiếp')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(inven.length === 1 || currentPage === inven.length);

    const row = new ActionRowBuilder().addComponents(prevButton, nextButton);

    const reply = await interaction.followUp({
      content: `🧰** ${interaction.user.username}** hiện có:\n${text}\n\n`,
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
          console.log('prev');

          currentPage -= 1;
        } else {
          console.log('next');

          currentPage += 1;
        }

        await prevButton.setDisabled(currentPage === 1);
        await nextButton.setDisabled(
          currentPage === inven.length || inven.length === 1
        );

        let newText = generateText();

        return await interaction.editReply({
          content: `🧰** ${interaction.user.username}** hiện có:\n${newText}\n\n`,
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
