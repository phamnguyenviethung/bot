const User = require('../../../core/models/user.model');
const itemRepo = require('../../../core/repositories/item.repo');
const inventoryService = require('../../../core/services/inventory.service');

const giveToOtherUser = async ({ sender, receiverID, itemCode, quantity }) => {
  const userToGive = await User.findOne({ discordID: receiverID });

  let isFailed = false;
  const failResponse = {
    success: false,
    message: 'Failed',
  };

  if (!userToGive) {
    isFailed = true;
    failResponse.message = 'Không tìm thấy người nhận';
  }

  const item = await itemRepo.getByCode(itemCode);

  if (!item) {
    isFailed = true;
    failResponse.message = 'Không tìm thấy item';
  }

  const isEnough = await inventoryService.isEnoughQuantity({
    userID: sender._id,
    itemCode,
    quantity,
  });

  if (!isEnough) {
    isFailed = true;
    failResponse.message = 'Bạn không đủ số lượng';
  }

  if (isFailed) {
    return failResponse;
  }

  await Promise.all([
    inventoryService.addInventory({
      userID: sender._id,
      itemCode,
      quantity: -quantity,
    }),
    inventoryService.addInventory({
      userID: userToGive._id,
      itemCode,
      quantity,
    }),
  ]);

  return {
    success: true,
    message: 'ok',
    data: {
      item,
      quantity,
    },
  };
};

module.exports = {
  giveToOtherUser,
};
