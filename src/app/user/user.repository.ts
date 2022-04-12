import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, MoreThan, Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import {
  LoginType,
  User,
  UserEmail,
  UserEmailValidateToken,
  UserLoginType,
  UserPassword,
} from '../../database/entities';
import { PasswordRegisterDto } from './dtos';
import { afterMinutes } from '../util/date/date-helper';
import { HasVerifiedException, UnreadyToSendException } from './exceptions';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly entity: Repository<User>,
    @InjectRepository(UserLoginType)
    private readonly loginTypeEntity: Repository<UserLoginType>,
    @InjectRepository(UserEmail)
    private readonly emailEntity: Repository<UserEmail>,
    @InjectRepository(UserEmailValidateToken)
    private readonly emailValidateTokenEntity: Repository<UserEmailValidateToken>,
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

  public async generateEmailValidateToken(email: string): Promise<string> {
    const user = await this.findWithEmail(email);

    if (user.email.isVerify) {
      throw new HasVerifiedException();
    }

    const currentDate = new Date();
    const periodToken = await this.emailValidateTokenEntity.findOne({
      where: {
        userEmailId: user.email.id,
        isUsed: false,
        expiredAt: MoreThan(currentDate),
      },
    });

    if (undefined !== periodToken) {
      throw new UnreadyToSendException();
    }

    const token = randomBytes(16).toString('hex');

    await this.emailValidateTokenEntity.save({
      email: user.email,
      token,
      isUsed: false,
      expiredAt: afterMinutes(5),
    });

    return token;
  }

  public async isEmailRegistered(email: string): Promise<boolean> {
    try {
      await this.findWithEmail(email);

      return true;
    } catch (error) {
      return false;
    }
  }

  private findWithEmail(email: string): Promise<Pick<User, 'id' | 'email'>> {
    return this.entity.findOneOrFail({
      // not support relation selection yet.
      select: ['id', 'email'],
      relations: ['email'],
      where: {
        email: {
          email,
        },
      },
    });
  }
}
