const Inventory = require('../models/inventory.model');
const itemRepo = require('../repositories/item.repo');
const BotError = require('../../utils/BotError');
class InventoryService {
  createInventory = async ({ userID, itemCode, quantity }) => {
    const item = await itemRepo.getByCode(itemCode);

    if (!item) {
      throw new BotError('Không tìm thấy item');
    }

    return await Inventory.findOneAndUpdate(
      {
        user: userID,
      },
      {
        $push: {
          items: {
            item: item._id,
            quantity,
          },
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
  };

  updateItemQuantity = async ({ quantity, userID, itemCode }) => {
    const item = await itemRepo.getByCode(itemCode);

    if (!item) {
      throw new BotError('Không tìm thấy item');
    }

    await Inventory.findOneAndUpdate(
      {
        user: userID,
        'items.item': item._id,
      },
      {
        $inc: {
          'items.$.quantity': quantity,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    return await this.clearEmpptyItems(userID);
  };

  addInventory = async ({ userID, itemCode, quantity }) => {
    const inven = await Inventory.findOne({ user: userID });
    if (!inven) {
      return await this.createInventory({ userID, itemCode, quantity });
    }

    if (quantity < 0) {
      const isEnough = await this.isEnoughQuantity({
        userID,
        itemCode,
        quantity: quantity * -1,
      });

      if (!isEnough) {
        throw new BotError('Bạn không đủ số lượng');
      }
    }
    console.log('hi');
    if (inven.items.length === 0) {
      const item = await itemRepo.getByCode(itemCode);
      inven.items = [
        {
          item: item._id,
          quantity,
        },
      ];

      return await inven.save();
    }

    return await this.updateItemQuantity({ userID, itemCode, quantity });
  };

  clearEmpptyItems = async (userID) => {
    return await Inventory.findOneAndUpdate(
      { user: userID },
      {
        $pull: {
          items: {
            quantity: 0,
          },
        },
      },
      {
        new: true,
      }
    );
  };

  isEnoughQuantity = async ({ userID, itemCode, quantity }) => {
    const item = await itemRepo.getByCode(itemCode);

    if (!item) {
      throw new BotError('Không tìm thấy item');
    }

    const inven = await Inventory.findOne({ user: userID });

    if (!inven) {
      throw new BotError('Không tìm kho đồ');
    }

    const itemInInven = inven.items.find(
      (i) => i.item.toString() === item._id.toString()
    );

    if (!itemInInven) {
      return false;
    }

    console.log(itemInInven, quantity);

    return itemInInven.quantity >= quantity;
  };
}

module.exports = new InventoryService();
