import { Document, model, Schema, Types } from 'mongoose';
import { ResultType } from './match.model';

export interface IBet extends Document {
  user: Types.ObjectId;
  match: Types.ObjectId;
  money: number;
  betType: ResultType;
  betChoice: any;
  isPaid: boolean;
}
const BetSchema = new Schema<IBet>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    match: {
      type: Schema.Types.ObjectId,
      ref: 'Match',
      required: true,
    },
    money: {
      type: Number,
      default: 0,
      min: [0, 'Không thể có số âm'],
      required: true,
    },
    betType: {
      type: String,
      enum: ResultType,
      required: true,
    },
    betChoice: {
      type: Schema.Types.Mixed,
      required: true,
    },
    isPaid: { type: Boolean, default: false },
  },

  {
    timestamps: true,
  }
);

const Bet = model<IBet>('Bet', BetSchema);
module.exports = Bet;
