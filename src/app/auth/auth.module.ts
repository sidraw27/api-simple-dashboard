import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { GoogleStrategy, FacebookStrategy } from './strategies';
import { AuthService } from './auth.service';
import { UserModule } from '../user';

@Module({
  imports: [ConfigModule, PassportModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, FacebookStrategy],
})
export class AuthModule {}
