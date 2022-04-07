import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import {
  User,
  UserEmail,
  UserLoginType,
  UserPassword,
} from '../../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserLoginType, UserEmail, UserPassword]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
