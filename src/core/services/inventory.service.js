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

  isInInventory = async ({ userID, itemCode }) => {
    const item = await itemRepo.getByCode(itemCode);

    const inven = await Inventory.findOne({
      user: userID,
      'items.item': item._id,
    });

    return !!inven;
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

    const isInInven = await this.isInInventory({ userID, itemCode });

    if (!isInInven) {
      const item = await itemRepo.getByCode(itemCode);

      await Inventory.findOneAndUpdate(
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
        }
      );
    } else {
      return await this.updateItemQuantity({ userID, itemCode, quantity });
    }
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

    return itemInInven.quantity >= quantity;
  };

  getInvenByUserID = async (userID) => {
    const inven = await Inventory.aggregate([
      { $match: { user: userID } }, // Match inventory by user
      {
        $lookup: {
          from: 'items', // Name of the item collection
          localField: 'items.item', // The field in inventory items to join on
          foreignField: '_id', // The field in the item collection to join on
          as: 'itemDetails', // Output array for matched items
        },
      },
      {
        $unwind: '$itemDetails', // Deconstruct the itemDetails array to work with individual items
      },
      {
        $unwind: '$items', // Deconstruct the itemDetails array to work with individual items
      },
      {
        $match: { $expr: { $eq: ['$items.item', '$itemDetails._id'] } }, // Ensure matched item and details
      },

      {
        $group: {
          _id: '$itemDetails.type', // Group by the item 'type'
          itemData: {
            $push: {
              // Push the necessary item data into an array
              id: '$itemDetails._id',
              name: '$itemDetails.name',
              code: '$itemDetails.code',
              quantity: '$items.quantity',
            },
          },
        },
      },
      {
        $project: {
          _id: 0, // Do not include the default _id field
          itemType: '$_id', // Rename _id to itemType (since we're grouping by type)
          itemData: 1, // Include the itemData array
        },
      },
      {
        $sort: { itemType: 1 }, // Optionally sort by itemType in ascending order
      },
    ]);


    return inven;
  };
}

module.exports = new InventoryService();
