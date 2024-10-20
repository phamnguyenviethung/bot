const { SlashCommandBuilder } = require('discord.js');
const checkgiaCore = require('./core/checkgia.core');
const thumuaCore = require('./core/thumua.core');

const CMD_NAME = {
  CHECK_GIA: 'checkgia',
  THU_MUA: 'thumua',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coin')
    .setDescription('coin')
    .addSubcommand((subcommand) =>
      subcommand
        .setName(CMD_NAME.CHECK_GIA)
        .setDescription('Xem giá mua bán coin')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(CMD_NAME.THU_MUA)
        .setDescription('Thu / Mua coin')
        .addStringOption((option) =>
          option
            .setName('hanhdong')
            .setDescription('Hành động')
            .setRequired(true)
            .addChoices([
              {
                name: 'Thu',
                value: 'thu',
              },
              {
                name: 'Mua',
                value: 'mua',
              },
            ])
        )
        .addNumberOption((option) =>
          option
            .setName('soluong')
            .setDescription('Số lượng')
            .setMinValue(1)
            .setRequired(true)
        )
    ),
  async run(data) {
    const subCMD = data.interaction.options.getSubcommand();

    switch (subCMD) {
      case CMD_NAME.CHECK_GIA:
        return await checkgiaCore(data);

      case CMD_NAME.THU_MUA:
        return await thumuaCore(data);

      default:
        return await data.interaction.followUp('Lệnh không hợp lệ');
    }
  },
};
