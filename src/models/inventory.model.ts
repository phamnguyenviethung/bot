import { Schema, model } from 'mongoose';
const inventorySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unqiue: true,
    },
    items: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: 'Item',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Inventory = model('Inventory', inventorySchema);
export default Inventory;
