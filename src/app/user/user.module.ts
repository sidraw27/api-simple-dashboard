import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RmqModule } from '../../job/queue';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import {
  User,
  UserEmail,
  UserLoginType,
  UserPassword,
} from '../../database/entities';
import { UserFacade } from './user.facade';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserLoginType, UserEmail, UserPassword]),
    RmqModule,
  ],
  controllers: [UserController],
  providers: [UserFacade, UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
