import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { RmqService } from '../../job/queue/rmq.service';
import { UserPatchDto } from './dtos';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserFacade {
  constructor(
    private readonly service: UserService,
    private readonly authService: AuthService,
    private readonly rmqService: RmqService,
    private readonly configService: ConfigService,
  ) {}

  public async sendValidateMail(uuid: string) {
    const { token, email } = await this.service.generateValidateToken(uuid);
    const mailBo: SendGrid.MailDataRequired = {
      to: email,
      from: 'admin@sidraw.tw',
      subject: 'Verify your account.',
      html: `<a href="${this.configService.get(
        'APP_URL',
      )}/emails/validate?token=${token}&email=${email}">click to validate email</a>`,
    };
    await this.rmqService.produce('send-register-mail', mailBo);
  }

  public async patchUser(uuid: string, dto: UserPatchDto) {
    if ('name' in dto) {
      return this.service.patchUserName(uuid, dto.name);
    }

    if (
      'oldPassword' in dto &&
      'password' in dto &&
      'passwordConfirmation' in dto
    ) {
      const user = await this.service.findUserByUUID(uuid);

      const isPass = await this.authService.validatePassword(
        dto.oldPassword,
        user.password.password,
      );

      if (!isPass) {
        throw new HttpException('Incorrect password.', HttpStatus.FORBIDDEN);
      }

      return this.service.patchPassword(uuid, dto.password);
    }

    throw new HttpException('Unknown target.', HttpStatus.BAD_REQUEST);
  }
}
