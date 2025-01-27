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
  async run({ client, interaction, rate, user }) {
    const baseSalary = _.round(rate.baseSalaryRate);
    const userRate = user.point * 2 + (user.money * 1) / 100;

    const randomMoney = _.round(userRate + baseSalary);
    await userRepo.plusMoney(interaction.user.id, randomMoney);
    await userService.incPointByWorking({ discordID: interaction.user.id });

    return await interaction.followUp(
      `🤝 **${interaction.user.username}** vừa được Tgau lì xì ${formatMoney(
        randomMoney
      )}`
    );
  },
};
