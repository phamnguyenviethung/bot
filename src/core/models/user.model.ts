import { Document, model, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  dID: string;
  pin: number;
  money: number;
  coin: number;
  role: Role;
  isActive: boolean;
}

export enum Role {
  Admin = 'admin',
  User = 'user',
}

const UserSchema = new Schema<IUser>(
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
    money: {
      type: Number,
      default: 0,
      min: [0, 'Không thể có số âm'],
    },
    coin: {
      type: Number,
      default: 0,
      min: [0, 'Không thể có số âm'],
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

UserSchema.pre(/^find/, function (this: Model<IUser>, next: any) {
  // this points to the current query
  this.find({ isActive: { $ne: false } });
  next();
});

const User = model<IUser>('User', UserSchema);
module.exports = User;
