import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class SendgridService {
  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(configService.get('SEND_GRID_API_KEY'));
  }

  public async send(mailBo: SendGrid.MailDataRequired) {
    await SendGrid.send(mailBo);

    Logger.log(`send to ${mailBo.to}`);
  }
}
