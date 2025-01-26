const { SlashCommandBuilder } = require('discord.js');
const BotError = require('../../utils/BotError');
const inventoryService = require('../../core/services/inventory.service');
const itemRepo = require('../../core/repositories/item.repo');
const userRepo = require('../../core/repositories/user.repo');
const formatMoney = require('../../utils/formatMoney');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buy')
    .setDescription('Mua hàng')
    .addStringOption((option) =>
      option.setName('code').setDescription('Mã item').setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName('quantity')
        .setDescription('Số lượng')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    ),
  async run({ client, interaction, user }) {
    const itemCode = interaction.options.getString('code').toLowerCase();
    const quantity = interaction.options.getNumber('quantity');

    const item = await itemRepo.getByCode(itemCode);
    if (!item) {
      throw new BotError('Không tìm thấy item');
    }

    if (!item.isActive) {
      throw new BotError('Item đã bị vô hiệu hoá');
    }

    const totalPrice = item.price * quantity;
    if (user.money < totalPrice) {
      throw new BotError(
        `Bạn không đủ ${formatMoney(totalPrice)} để mua **${quantity} ${
          item.name
        }** \`${item.code}\``
      );
    }

    await userRepo.plusMoney(user.discordID, -totalPrice);

    await inventoryService.addAndUpdateInven({
      userID: user._id,
      code: itemCode,
      quantity,
    });

    return await interaction.followUp(
      `💰 **${interaction.user.username}** vừa mua **${quantity} ${
        item.name
      }** \`${item.code}\` với tổng giá là ${formatMoney(totalPrice)}`
    );
  },
};
