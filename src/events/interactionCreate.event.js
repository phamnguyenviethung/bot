const User = require('../core/models/user.model');
const { checkCooldown } = require('../core/services/cooldown.service');
const { logger } = require('../configs/logger.config');
const BotError = require('../utils/BotError');

const whiteList = ['dangky'];

module.exports = async (client, interaction) => {
  if (interaction.isChatInputCommand()) {
    const cmdName = interaction.commandName;
    try {
      const user = await User.findOne({
        discordID: interaction.user.id,
      });

      if (!user) {
        if (!whiteList.includes(cmdName)) {
          return interaction.followUp(
            'Bạn chưa đăng ký, hãy nhập /dangky để đăng ký'
          );
        }
      }

      const command = client.interactions.get(cmdName);
      if (!command) return interaction.followUp('Lệnh không hợp lệ');

      if (!command.noDefer) await interaction.deferReply();

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
      if (error instanceof BotError) {
        return interaction.followUp(error.message);
      }

      return interaction.followUp(`**${cmdName}**: có lỗi xảy ra`);
    }
  }
};
