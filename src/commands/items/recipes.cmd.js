const { SlashCommandBuilder } = require('discord.js');
const craftService = require('../../core/services/craft.service');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('item')
    .setDescription('item')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('xemcongthuc')
        .setDescription('Danh sách công thức chế')
    ),
  async run({ client, interaction }) {
    const a = await craftService.getAllRecipes();
    console.log(a);
    await interaction.followUp(
      `🏓Latency is ${
        Date.now() - interaction.createdTimestamp
      }ms. API Latency is ${Math.round(client.ws.ping)}ms :ca:`
    );
  },
};
