const mongoose = require('mongoose');

const Schema = mongoose.Schema;

export enum Role {
  Admin = 'admin',
  User = 'user',
}

const UserSchema = new Schema(
  {
    username: {
      type: String,
      require: [true, 'Vui lòng cung cấp họ tên'],
      trim: true,
    },
    dID: {
      type: String,
      require: [true, 'Vui lòng cung cấp discord ID'],
      trim: true,
      unique: true,
    },
    pin: {
      type: Number,
      required: [true, 'Yêu cầu phải có mật khẩu'],
      min: [1000, 'Chỉ có 4 chữ số'],
      max: [9999, 'Chỉ có 4 chữ số'],
    },
    role: {
      type: String,
      default: Role.User,
      enum: Role,
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ isActive: { $ne: false } });
  next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
