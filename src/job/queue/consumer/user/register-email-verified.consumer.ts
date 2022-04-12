import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import * as SendGrid from '@sendgrid/mail';
import { SendgridService } from '../../../../app/util/sendgrid/sendgrid.service';

@Controller()
export class RegisterEmailVerifiedConsumer {
  constructor(private readonly sendgridService: SendgridService) {}

  @EventPattern('send-register-mail', Transport.RMQ)
  public async execute(
    @Payload() data: SendGrid.MailDataRequired,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      await this.sendgridService.send(data);
    } catch (error) {
      Logger.error('send failed');
      throw error;
    }

    Logger.log(data);
    channel.ack(message);
  }
}
