const { ButtonBuilder } = require('discord.js');

module.exports = ({ customID, label, style, isDisable, emoji }) => {
  const btn = new ButtonBuilder()
    .setCustomId(customID)
    .setLabel(label)
    .setStyle(style)
    .setDisable(isDisable)
    .setEmoji(emoji);

  return btn;
};
