import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '../../job/queue';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import {
  User,
  UserEmail,
  UserEmailValidateToken,
  UserLoginType,
  UserPassword,
} from '../../database/entities';
import { UserFacade } from './user.facade';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      User,
      UserLoginType,
      UserEmail,
      UserEmailValidateToken,
      UserPassword,
    ]),
    RmqModule,
  ],
  controllers: [UserController],
  providers: [UserFacade, UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
