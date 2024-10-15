const Item = require('../models/item.model');

class ItemService {
  addNewItem = async (data) => {
    return await Item.create(data);
  };
}

module.exports = new ItemService();
