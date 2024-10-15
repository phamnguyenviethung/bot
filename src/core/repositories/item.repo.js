const Item = require('../models/item.model');

class ItemRepository {
  getByCode = async (code) => {
    const item = await Item.findOne({ code });
    return item;
  };
}

module.exports = new ItemRepository();
