const { random } = require('chance-percent');
const { Rarity } = require('../../../constants/item.constants');
const _ = require('lodash');
const itemService = require('../../../core/services/item.service');
const randomRarity = () => {
  const options = [
    { value: Rarity.COMMON, percentage: 75 },
    { value: Rarity.RARE, percentage: 24 },
    { value: Rarity.EPIC, percentage: 1 },
  ];

  return random(options);
};

const randomQuantity = (rarity) => {
  let n = 0;

  switch (rarity) {
    case Rarity.EPIC:
      n = _.random(1, 2);
      break;
    default:
      n = _.random(2, 5);
      break;
  }

  return n;
};

const dig = async () => {
  const rarity = randomRarity();
  const q = randomQuantity(rarity);
  const item = await itemService.getDigItem({ rarity });

  if (!item) {
    return {
      success: false,
      message: 'Có vẫn đề gì đó rồi ! Hãy báo Hack',
    };
  }

  return {
    success: true,
    message: 'ok',
    data: {
      item,
      quantity: q,
    },
  };
};

module.exports = {
  dig,
};
