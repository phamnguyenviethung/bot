const { Schema, model } = require('mongoose');
const roles = require('../../constants/role.constants');
const userSchema = new Schema(
  {
    discordID: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default: roles.USER,
      enum: Object.values(roles),
    },
    money: {
      type: Number,
      default: 0,
      min: 0,
      set: (v) => Math.round(v),
    },

    point: {
      type: Number,
      default: 10,
      min: 0,
    },
    latestWinPrize: {
      type: Number,
      default: 0,
      min: 0,
      set: (v) => Math.round(v),
    },
  },
  {
    timestamps: true,
  }
);

const User = model('User', userSchema);
module.exports = User;
