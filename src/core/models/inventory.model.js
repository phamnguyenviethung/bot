const { Schema, model } = require('mongoose');
const inventorySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unqiue: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    item: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Inventory = model('Inventory', inventorySchema);
module.exports = Inventory;
