import { Schema, model } from 'mongoose';
const ItemTypes = {
  WEAPON: 'vũ khí',
  TOOL: 'công cụ',
  MATERIAL: 've chai',
  OTHER: 'khác',
};

const itemSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: Object.values(ItemTypes),
      default: ItemTypes.OTHER,
      lowercase: true,
    },
    totalQuantity: {
      type: Number,
      min: 0,
      default: 0,
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    attributes: [
      {
        k: String,
        name: String,
        v: Schema.Types.Mixed,
        _id: false,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
const Item = model('Item', itemSchema);
export default Item;
