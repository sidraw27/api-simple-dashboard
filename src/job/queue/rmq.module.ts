import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RmqService } from './rmq.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'rmq-module',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) =>
          configService.get('rmq'),
      },
    ]),
  ],
  exports: [RmqService],
  providers: [RmqService],
})
export class RmqModule {}
