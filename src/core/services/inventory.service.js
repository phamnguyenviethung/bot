const Inventory = require('../models/inventory.model');
const itemRepo = require('../repositories/item.repo');
const BotError = require('../../utils/BotError');
const User = require('../models/user.model');
class InventoryService {
  isEnoughQuantity = async ({ userID, code, quantity }) => {
    const item = await itemRepo.getByCode(code);
    if (!item) {
      throw new BotError(`Không tìm thấy item với code: ${code}`);
    }
    const inven = await Inventory.findOne({ user: userID, item: item._id });

    return inven.quantity >= quantity;
  };

  addAndUpdateInven = async ({ userID, code, quantity }) => {
    const item = await itemRepo.getByCode(code);
    if (!item) {
      throw new BotError(`Không tìm thấy item với code: ${code}`);
    }
    return await Inventory.findOneAndUpdate(
      {
        user: userID,
        item: item._id,
      },
      {
        $inc: { quantity },
      },
      {
        upsert: true,
        new: true,
      }
    );
  };

  getUserInven = async (userID) => {
    return await Inventory.aggregate([
      {
        $match: {
          user: userID,
          quantity: { $gt: 0 },
        },
      },
      {
        $lookup: {
          from: 'items',
          localField: 'item',
          foreignField: '_id',
          as: 'item',
        },
      },
      {
        $match: {
          'item.isActive': true,
        },
      },
      {
        $unwind: '$item',
      },
      {
        $sort: { 'item.type': 1, 'item.code': 1 },
      },
      {
        $group: {
          _id: '$item.type',
          items: {
            $push: {
              item: '$item',
              quantity: '$quantity',
            },
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

  give = async ({ ownerID, targetID, code, quantity }) => {
    const target = await User.findOne({ discordID: targetID });
    if (!target) {
      throw new BotError('Người nhận chưa đăng ký');
    }

    const item = await itemRepo.getByCode(code);
    if (!item) {
      throw new BotError(`Không tìm thấy item với code: ${code}`);
    }

    if (!item.isActive) {
      throw new BotError('Item đã bị vô hiệu hóa');
    }

    const isEnough = await this.isEnoughQuantity({
      userID: ownerID,
      code,
      quantity,
    });
    if (!isEnough) {
      throw new BotError('Không đủ item để chuyển');
    }

    await this.addAndUpdateInven({
      userID: ownerID,
      code,
      quantity: quantity * -1,
    });

    await this.addAndUpdateInven({
      userID: target._id,
      code,
      quantity,
    });
    return {
      item,
    };
  };
}

module.exports = new InventoryService();
