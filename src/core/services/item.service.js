const Item = require('../models/item.model');
const _ = require('lodash');
class ItemService {
  getActiveItems = async (filter, projection = null, options) => {
    return await Item.find({ ...filter, isActive: true }, projection, options);
  };
  getGroupItemByTags = async (tags) => {
    return await Item.aggregate([
      {
        $match: {
          tags: { $in: [].concat(tags) },
          isActive: true,
        },
      },
      {
        $sort: { code: 1 },
      },
      {
        $group: {
          _id: '$type',
          items: {
            $push: '$$ROOT',
          },
        },
      },

      {
        $project: {
          _id: 0,
          type: '$_id',
          items: 1,
        },
      },
      {
        $sort: { type: 1 },
      },
    ]);
  };
}

module.exports = new ItemService();
