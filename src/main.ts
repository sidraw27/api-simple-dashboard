import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.connectMicroservice<MicroserviceOptions>(configService.get('rmq'));
  app.enableCors({
    credentials: true,
    origin: process.env.APP_URL,
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}

(async () => {
  await bootstrap();
})();
