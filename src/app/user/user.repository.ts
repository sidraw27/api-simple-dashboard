import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, getManager, Repository } from 'typeorm';
import {
  LoginType,
  User,
  UserEmail,
  UserLoginType,
  UserPassword,
} from '../../database/entities';
import { PasswordRegisterDto } from './dtos';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly entity: Repository<User>,
    @InjectRepository(UserLoginType)
    private readonly loginTypeEntity: Repository<UserLoginType>,
    @InjectRepository(UserEmail)
    private readonly emailEntity: Repository<UserEmail>,
    @InjectRepository(UserPassword)
    private readonly passwordEntity: Repository<UserPassword>,
  ) {}

  public async createUser(dto: PasswordRegisterDto) {
    await getManager().transaction(async (manager) => {
      const user = await manager.save(
        this.entity.create({ name: 'Custom User' }),
      );
      await manager.save(
        this.loginTypeEntity.create({
          userId: user.id,
          type: LoginType.PASSWORD,
        }),
      );
      await manager.save(
        this.emailEntity.create({
          userId: user.id,
          email: dto.email,
          isVerify: false,
        }),
      );
      await manager.save(
        this.passwordEntity.create({
          userId: user.id,
          password: dto.password,
        }),
      );
    });
  }

  public async isEmailRegistered(email: string): Promise<boolean> {
    try {
      await this.entity.findOneOrFail({
        relations: ['email'],
        where: {
          email: {
            email,
          },
        },
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}
