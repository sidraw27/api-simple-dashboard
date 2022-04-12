import { Injectable } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { RmqService } from '../../job/queue/rmq.service';
import { PasswordRegisterDto } from './dtos';

@Injectable()
export class UserFacade {
  constructor(
    private readonly service: UserService,
    private readonly rmqService: RmqService,
    private readonly configService: ConfigService,
  ) {}

  public async sendValidateMail(toMail: PasswordRegisterDto['email']) {
    const token = await this.service.generateValidateToken(toMail);
    const mailBo: SendGrid.MailDataRequired = {
      to: toMail,
      from: 'admin@sidraw.tw',
      subject: 'Verify your account.',
      html: `<a href="${this.configService.get(
        'APP_URL',
      )}/emails/validate?token=${token}&email=${toMail}">click to validate email</a>`,
    };
    await this.rmqService.produce('send-register-mail', mailBo);
  }
}
