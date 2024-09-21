const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TeamSchema = new Schema(
  {
    name: String,
    logoURL: String,
    isActvie: { type: Boolean, default: true },
  },

  {
    timestamps: true,
  }
);

TeamSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ isActive: { $ne: false } });
  next();
});

const Team = mongoose.model('Team', TeamSchema);
module.exports = Team;
