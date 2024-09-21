import { ResultType } from './match.model';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BetSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    match: {
      type: Schema.Types.ObjectId,
      ref: 'Match',
    },
    money: {
      type: Number,
      default: 0,
      min: [0, 'Không thể có số âm'],
    },
    betType: {
      type: String,
      enum: ResultType,
    },
    isPaid: { type: Boolean, default: false },
  },

  {
    timestamps: true,
  }
);

const Bet = mongoose.model('Bet', BetSchema);
module.exports = Bet;
