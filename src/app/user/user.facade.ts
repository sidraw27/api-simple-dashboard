import { Injectable } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { RmqService } from '../../job/queue/rmq.service';

@Injectable()
export class UserFacade {
  constructor(
    private readonly service: UserService,
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
}
