import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user';
import { StatisticsModule } from '../../statistics/statistics.module';
import { AuthController } from './auth.controller';
import {
  LocalStrategy,
  GoogleStrategy,
  FacebookStrategy,
  JwtStrategy,
} from './strategies';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          // no expired
          secret: configService.get('JWT_SECRET'),
        };
      },
    }),
    StatisticsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    GoogleStrategy,
    FacebookStrategy,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
