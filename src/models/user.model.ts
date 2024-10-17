import { Schema, model } from 'mongoose';
const roles = {
  USER: 'user',
  ADMIN: 'admin',
};
const userSchema = new Schema(
  {
    discordID: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default: 'user',
      enum: Object.values(roles),
    },
    money: {
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
export default User;
