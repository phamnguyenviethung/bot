const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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
    },
    team2: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
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

MatchSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ isActive: { $ne: false } });
  next();
});

const Match = mongoose.model('Match', MatchSchema);
module.exports = Match;
