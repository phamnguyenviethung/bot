const formatMoney = require('../../../utils/formatMoney');
const formatCoin = require('../../../utils/formatCoin');
const userRepo = require('../../../core/repositories/user.repo');
module.exports = async ({ client, interaction, user, economicRate }) => {
  const action = interaction.options.getString('hanhdong');
  const quantity = interaction.options.getNumber('soluong');

  if (action === 'thu') {
    if (!economicRate.canSellCoin) {
      return await interaction.followUp('Hiện tại ngân hàng không thu coin');
    }

    if (quantity < 10) {
      return await interaction.followUp('Số lượng thu tối thiểu là 10');
    }

    if (quantity > user.coin || user.coin <= 0) {
      return await interaction.followUp('Số lượng coin không đủ');
    }

    const price = quantity * economicRate.coinSellPrice;

    await userRepo.plusMoney(user.discordID, price);
    await userRepo.plusCoin(user.discordID, -quantity);

    return await interaction.followUp(
      `**${interaction.user.username}** đã bán ${formatCoin(
        quantity
      )} với giá ${formatMoney(price)}`
    );
  } else {
    const price = quantity * economicRate.coinBuyPrice;

    if (user.money <= 0 || user.money < price) {
      return await interaction.followUp('Số dư không đủ');
    }

    await userRepo.plusMoney(user.discordID, -price);
    await userRepo.plusCoin(user.discordID, quantity);

    return await interaction.followUp(
      `**${interaction.user.username}** đã mua ${formatCoin(
        quantity
      )} với giá ${formatMoney(price)}`
    );
  }
};
