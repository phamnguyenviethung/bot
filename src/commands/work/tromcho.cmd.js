const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('tromcho').setDescription('Trộm chó'),
  async run({ client, interaction }) {
    await interaction.followUp(
      `🏓Latency is ${
        Date.now() - interaction.createdTimestamp
      }ms. API Latency is ${Math.round(client.ws.ping)}ms :ca:`
    );
  },
};
