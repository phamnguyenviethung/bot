const { SlashCommandBuilder } = require('discord.js');
const BotError = require('../../utils/BotError');
const inventoryService = require('../../core/services/inventory.service');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('give')
    .setDescription('Đưa đồ cho người khác')
    .addUserOption((option) =>
      option.setName('user').setDescription('Người nhận').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('code').setDescription('Mã item').setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName('quantity')
        .setDescription('Số lượng')
        .setRequired(true)
        .setMinValue(1)
    ),
  async run({ client, interaction, user }) {
    const u = interaction.options.getUser('user');
    const itemCode = interaction.options.getString('code');
    const quantity = interaction.options.getNumber('quantity');

    if (u.id === user.discordID) {
      throw new BotError('Không thể tự chuyển cho chính mình');
    }

    const { item } = await inventoryService.give({
      ownerID: user._id,
      targetID: u.id,
      code: itemCode.toLowerCase(),
      quantity,
    });

    return await interaction.followUp(
      `💰 **${interaction.user.username}** vừa đưa **${quantity} ${item.name}** \`${item.code}\` cho ${u.username}`
    );
  },
};
