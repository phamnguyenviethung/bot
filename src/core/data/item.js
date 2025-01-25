const { logger } = require('../../configs/logger.config');
const { ItemTypes } = require('../../constants/item.constants');
const Item = require('../models/item.model');

const items = [
  {
    code: 'dao',
    name: 'Dao',
    type: ItemTypes.WEAPON,
    tags: ['vũ khí'],
    attributes: [],
  },
];
const initItemData = async () => {
  try {
    await Promise.all(
      items.map(async (i) => {
        return await Item.findOneAndUpdate(
          {
            code: i.code,
          },
          i,
          {
            upsert: true,
            new: true,
          }
        );
      })
    );

    const codeList = items.map((i) => i.code);

    await Item.updateMany(
      {
        code: { $nin: codeList },
      },
      {
        $set: {
          isActive: false,
        },
      }
    );

    logger.info('Load item data thanh cong');
  } catch (error) {
    logger.error(error);
    throw new Error('Failed to init item data');
  }
};

module.exports = initItemData;
