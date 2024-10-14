const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  discordID: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin'],
  },
});

const User = model('User', userSchema);
module.exports = User;
