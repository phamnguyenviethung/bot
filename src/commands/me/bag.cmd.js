const { SlashCommandBuilder } = require('discord.js');
const Inventory = require('../../core/models/inventory.model');

module.exports = {
  data: new SlashCommandBuilder().setName('bag').setDescription('Kho đồ'),
  async run({ client, interaction, user }) {
    const inven = await Inventory.findOne({
      user: user.id,
    })
      .populate('items.item')
      .select('items');

    let text = '';

    inven.items.forEach((i) => {
      text += `- ${i.item.name}: **${i.quantity}**\n`;
    });

    return await interaction.followUp(
      `🧰** ${interaction.user.username}** hiện có:\n\n${text}`
    );
  },
};
