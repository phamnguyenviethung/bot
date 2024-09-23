import { Document, model, Model, Schema } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  logoURL: string;
  isActive: boolean;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: String,
    logoURL: String,
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

TeamSchema.pre(/^find/, function (this: Model<ITeam>, next: any) {
  // this points to the current query
  this.find({ isActive: { $ne: false } });
  next();
});

const Team = model<ITeam>('Team', TeamSchema);
module.exports = Team;
