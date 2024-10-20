const formatCoin = require('../../../utils/formatCoin');

module.exports = async ({ client, interaction, economicRate }) => {
  const { coinBuyPrice, coinSellPrice, canSellCoin } = economicRate;

  let text = '🪙 Ngân hàng Kaka xin báo giá coin: \n\n';
  text += `- Giá mua: ${formatCoin(coinBuyPrice)}\n`;
  text += `- Giá thu: ${
    canSellCoin
      ? formatCoin(coinSellPrice)
      : '*Tạm thời không nhận vì Kaka không cần coin*'
  }\n`;

  return await interaction.followUp(text);
};
