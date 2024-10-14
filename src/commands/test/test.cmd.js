const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Kiểm tra độ trễ'),
  async run({ client, interaction }) {
    await interaction.followUp(
      `🏓Latency is ${
        Date.now() - interaction.createdTimestamp
      }ms. API Latency is ${Math.round(client.ws.ping)}ms`
    );
  },
};
