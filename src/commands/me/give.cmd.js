const { SlashCommandBuilder } = require('discord.js');
const User = require('../../core/models/user.model');
const formatMoney = require('../../utils/formatMoney');
const itemRepo = require('../../core/repositories/item.repo');
const inventoryService = require('../../core/services/inventory.service');
const { giveToOtherUser } = require('./core/give.core');
const BotError = require('../../utils/BotError');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('give')
    .setDescription('Thong tin ca nhan')
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

    const res = await giveToOtherUser({
      sender: user,
      receiverID: u.id,
      itemCode,
      quantity,
    });

    if (!res.success) {
      throw new BotError(res.message);
    }

    return await interaction.followUp(
      `💰 **${interaction.user.username}** vừa đưa **${quantity} ${res.data.item.name}** cho ${u.username}`
    );
  },
};
