const {
  StringSelectMenuOptionBuilder,
  StringSelectMenuBuilder,
} = require('discord.js');

module.exports = ({ customID, label, value, desc, emoji, isDefault }) => {
  const select = new StringSelectMenuBuilder()
    .setCustomId(customID)
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel(label)
        .setValue(value)
        .setDescription(desc)
        .setEmoji(emoji)
        .setDefault(isDefault)
    );

  return select;
};
