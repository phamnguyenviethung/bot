import { Document, model, Schema, Types } from 'mongoose';

export interface IMatch extends Document {
  matchDate: Date;
  team1: Types.ObjectId;
  team2: Types.ObjectId;
  defaultRate: number;
  rate: {
    name: string;
    value: number;
  }[];
  result: {
    name: string;
    value: any;
  }[];
  isDone: boolean;
}

export enum ResultType {
  FirstBlood = 'FirstBlood',
  FirstDragon = 'FirstDragon',
  FirstTurret = 'FirstTurret',
  Winner = 'Winner',
}

const MatchSchema = new Schema(
  {
    matchDate: Date,
    team1: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    team2: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    defaultRate: {
      type: Number,
      default: 2,
    },
    rate: [
      {
        name: {
          type: String,
          enum: ResultType,
        },
        value: {
          type: Number,
          default: 2,
          min: 0,
        },
      },
    ],
    result: [
      {
        name: {
          type: String,
          enum: ResultType,
        },
        value: Schema.Types.Mixed,
      },
    ],

    isDone: { type: Boolean, default: false },
  },

  {
    timestamps: true,
  }
);

const Match = model('Match', MatchSchema);
module.exports = Match;
