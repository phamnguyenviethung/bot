const Item = require('../models/item.model');
const _ = require('lodash');
class ItemService {
  addNewItem = async (data) => {
    return await Item.create(data);
  };

  getDigItem = async ({ rarity }) => {
    const listItems = await this.getAllDigItems({
      attributes: {
        $elemMatch: {
          k: 'rare',
          v: rarity,
        },
      },
    });

    const item = _.sample(listItems);

    if (!item) {
      return null;
    }

    return item;
  };

  getAllDigItems = async (filter = {}) => {
    const digItems = await Item.find({
      tags: {
        $in: ['dig'],
      },
      ...filter,
    });

    return digItems;
  };
}

module.exports = new ItemService();
