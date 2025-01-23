const { SlashCommandBuilder } = require('discord.js');
const userRepo = require('../../core/repositories/user.repo');
const _ = require('lodash');
const formatMoney = require('../../utils/formatMoney');
const userService = require('../../core/services/user.service');
module.exports = {
  cooldown: 20,
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('lam viec kiem tien'),
  async run({ client, interaction, finRate, user }) {
    const baseSalary = _.random(500, 1000);
    const userRate = user.point * 0.25 + user.money * 0.0001;

    const workRate = _.round(userRate + finRate / 1000000);
    const randomMoney =
      _.random(_.round(workRate * 0.6), workRate) + baseSalary;
    await userRepo.plusMoney(interaction.user.id, randomMoney);
    await userService.incPointByWorking({ discordID: interaction.user.id });

    return await interaction.followUp(
      `🤝 **${interaction.user.username}** vừa được Tgau lì xì ${formatMoney(
        randomMoney
      )}`
    );
  },
};
