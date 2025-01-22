const { SlashCommandBuilder } = require('discord.js');
const userRepo = require('../../core/repositories/user.repo');
const _ = require('lodash');
const formatMoney = require('../../utils/formatMoney');
module.exports = {
  cooldown: 20,
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('lam viec kiem tien'),
  async run({ client, interaction }) {
    const randomMoney = _.random(100, 1000);

    await userRepo.plusMoney(interaction.user.id, randomMoney);

    return await interaction.followUp(
      `🤝 **${interaction.user.username}** vừa được Tgau lì xì${formatMoney(
        randomMoney
      )}`
    );
  },
};
