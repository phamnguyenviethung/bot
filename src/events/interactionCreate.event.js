const User = require('../core/models/user.model');
const { checkCooldown } = require('../core/services/cooldown.service');
const { logger } = require('../configs/logger.config');

module.exports = async (client, interaction) => {
  if (interaction.isChatInputCommand()) {
    const cmdName = interaction.commandName;
    try {
      await interaction.deferReply();
      const user = await User.findOne({
        discordID: interaction.user.id,
      });

      const command = client.interactions.get(cmdName);
      if (!command) return interaction.followUp('Lệnh không hợp lệ');

      const isValidCooldown = await checkCooldown({
        client,
        command,
        interaction,
      });

      if (isValidCooldown) {
        await command.run({ client, interaction, user });
      }
    } catch (error) {
      logger.error('IC:', error);
      return interaction.followUp(`**${cmdName}**: có lỗi xảy ra`);
    }
  }
};
