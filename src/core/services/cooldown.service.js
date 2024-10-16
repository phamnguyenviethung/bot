const { Collection } = require('discord.js');
const commandConfig = require('../../configs/command.config');

class CooldownService {
  checkCooldown({ client, command, interaction }) {
    if (!client.cooldowns.has(command.data.name)) {
      client.cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = client.cooldowns.get(command.data.name);
    const cooldownAmount =
      (command.cooldown || commandConfig.DEFAULT_COOLDOWN) * 1000;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime =
        timestamps.get(interaction.user.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        const replyText = `Vui lòng chờ để sử dụng. Bạn có thể quay lại sau **${timeLeft.toFixed(
          0
        )} giây**`;
        if (!command.noDefer) {
          interaction.followUp(replyText);
        } else {
          interaction.reply(replyText);
        }

        return false;
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    return true;
  }

  resetCooldown({ client, command, interaction }) {
    client.cooldowns.get(command.data.name).delete(interaction.user.id);
  }
}

module.exports = new CooldownService();
