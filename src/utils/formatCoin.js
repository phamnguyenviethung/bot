const numeral = require('numeral');

module.exports = (coin) => {
  const rs = numeral(coin).format('0,0');

  return `**${rs}** 💠`;
};
