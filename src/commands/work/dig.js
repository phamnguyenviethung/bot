const { SlashCommandBuilder } = require('discord.js');
const userRepo = require('../../core/repositories/user.repo');
const _ = require('lodash');
const formatMoney = require('../../utils/formatMoney');
const { dig } = require('./core/dig.core');
const inventoryService = require('../../core/services/inventory.service');
module.exports = {
  cooldown: 30,
  data: new SlashCommandBuilder()
    .setName('dig')
    .setDescription('Dao mo kiem tien'),
  async run({ client, interaction, user }) {
    const digData = await dig();
    if (!digData.success) {
      return await interaction.followUp(digData.message ?? 'Có lỗi rồi sir');
    }

    const { item, quantity } = digData.data;

    await inventoryService.addInventory({
      userID: user._id,
      itemCode: item.code,
      quantity,
    });

    return await interaction.followUp(
      `🏓 **${interaction.user.username}** đã đào được **${quantity} ${item.name}**`
    );
  },
};
