const { Schema, model } = require('mongoose');

const recipeSchema = new Schema(
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
    ingredients: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: 'Item',
        },
        quantity: {
          type: Number,
          min: 0,
          default: 0,
        },
        _id: false,
      },
    ],
    result: {
      item: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
      },
      quantity: {
        type: Number,
        min: 0,
        default: 0,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = model('Recipe', recipeSchema);
module.exports = Recipe;
