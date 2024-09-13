import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';
import UserService from '../core/services/user.service';
import { SlashOption } from 'discordx';
const { faker } = require('@faker-js/faker');
const { Discord, Slash } = require('discordx');
const BaseCMD = require('../common/base/base.cmd');
@Discord()
export class AccountCMD extends BaseCMD {
  private userService: UserService = new UserService();

  @Slash({ name: 'dangky', description: 'Đăng ký tài khoản', cooldown: 5 })
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
      const dID = interaction.user.id;
      const username = usernameInput.trim().toLowerCase();
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

      const randomPin = faker.random.number({ min: 1000, max: 9999 });

      await this.userService.create({ username, dID, pin: randomPin });

      await interaction.reply(
        `Đăng ký thành công, mã pin của bạn là: ${randomPin}`
      );
    } catch (error) {
      this.logError(error);
      await interaction.reply('Đã có lỗi xảy ra');
    }
  }

  @Slash({ name: 'dangnhap', description: 'Đăng nhập tài khoản' })
  async resetPin(interaction: CommandInteraction): Promise<void> {
    try {
      const dID = interaction.user.id;
      const user = await this.userService.getOne({ dID });

      if (!user) {
        await interaction.reply('Bạn chưa dăng kí');
        return;
      }
      const randomPin = faker.random.number({ min: 1000, max: 9999 });

      await this.userService.update(user._id, { pin: randomPin });
    } catch (error) {
      this.logError(error);
      await interaction.reply('Đã có lỗi xảy ra');
    }
  }
}
