import { Module } from '@nestjs/common';
import { RegisterEmailVerifiedConsumer } from './user';
import { SendgridModule } from '../../../app/util/sendgrid';

@Module({
  imports: [SendgridModule],
  controllers: [RegisterEmailVerifiedConsumer],
})
export class ConsumerModule {}
