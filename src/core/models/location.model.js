const { Schema, model } = require('mongoose');
const locationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Location = model('Location', locationSchema);
module.exports = Location;
