import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';
import UserService from '../core/services/user.service';
import { SlashOption } from 'discordx';
import { faker } from '@faker-js/faker';
const { Discord, Slash } = require('discordx');
const BaseCMD = require('@/common/base/Base.cmd');
@Discord()
export class BetCMD extends BaseCMD {
  private userService: UserService = new UserService();
  constructor() {
    super();
  }

  @Slash({ name: 'bet', description: 'Đăng ký tài khoản' })
  async register(
    @SlashOption({
      name: 'username',
      description: 'Tên đăng nhập',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    usernameInput: string,
    interaction: CommandInteraction
  ): Promise<void> {
    try {
      const dID: string = interaction.user.id;
      const username: string = usernameInput.trim().toLowerCase();
      const dIDExist = await this.userService.getOne({ dID });
      if (dIDExist) {
        await interaction.reply('Tài khoản discord này đã được đăng ký rồi');
        return;
      }

      const usenameExist = await this.userService.getOne({ username });
      if (usenameExist) {
        await interaction.reply('Tên đăng nhập đã tồn tại');
        return;
      }
      const randomPin: number = faker.number.int({ min: 1000, max: 9999 });
      await this.userService.create({ username, dID, pin: randomPin });
      await interaction.reply(
        `Đăng ký thành công, mã pin của bạn là: ${randomPin}`
      );
    } catch (error) {
      await this.logError(error, interaction);
    }
  }
}
