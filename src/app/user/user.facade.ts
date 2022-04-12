import { Injectable } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';
import { UserService } from './user.service';
import { RmqService } from '../../job/queue/rmq.service';
import { PasswordRegisterDto } from './dtos';

@Injectable()
export class UserFacade {
  constructor(
    private readonly service: UserService,
    private readonly rmqService: RmqService,
  ) {}

  public async sendVerifyMail(toMail: PasswordRegisterDto['email']) {
    const mailBo: SendGrid.MailDataRequired = {
      to: toMail,
      from: 'admin@sidraw.tw',
      subject: 'Verify your account.',
      html: `<a>verify</a>`,
    };
    await this.rmqService.produce('send-register-mail', mailBo);
  }
}
