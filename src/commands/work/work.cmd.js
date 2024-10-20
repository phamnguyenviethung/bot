const { SlashCommandBuilder } = require('discord.js');
const { cooldown } = require('../games/thansohoc.cmd');
const userRepo = require('../../core/repositories/user.repo');
const _ = require('lodash');
const formatMoney = require('../../utils/formatMoney');
module.exports = {
  cooldown: 20,
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('lam viec kiem tien'),
  async run({ client, interaction, economicRate }) {
    const randomMoney = _.random(
      10000 * economicRate.main,
      500000 * (economicRate.main + 2)
    );

    await userRepo.plusMoney(interaction.user.id, randomMoney);

    return await interaction.followUp(
      `🏓 **${
        interaction.user.username
      }** đang thất nghiệp và được Tgau bố thí ${formatMoney(randomMoney)}`
    );
  },
};
