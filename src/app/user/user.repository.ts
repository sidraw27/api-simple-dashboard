import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, getManager, MoreThan, Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import {
  LoginType,
  Provider,
  User,
  UserEmail,
  UserEmailValidateToken,
  UserLoginType,
  UserOauthProvider,
  UserPassword,
} from '../../database/entities';
import {
  isPasswordRegisterDto,
  PasswordRegisterDto,
  EmailValidateDto,
  OauthRegisterDto,
} from './dtos';
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
    @InjectRepository(UserOauthProvider)
    private readonly oauthProviderEntity: Repository<UserOauthProvider>,
  ) {}

  public async createUser(
    dto: PasswordRegisterDto | OauthRegisterDto,
  ): Promise<Pick<User, 'uuid' | 'name' | 'loginType'>> {
    return getManager().transaction(async (manager) => {
      const isPasswordRegister = isPasswordRegisterDto<OauthRegisterDto>(dto);

      const name = isPasswordRegister ? 'Custom User' : dto.name;
      const user = await manager.save(this.entity.create({ name }));

      const { id: userId } = user;
      const { email } = dto;

      user.loginType = await manager.save(
        this.loginTypeEntity.create({
          userId,
          type: isPasswordRegister ? LoginType.PASSWORD : LoginType.OAUTH,
        }),
      );
      await manager.save(
        this.emailEntity.create({
          userId,
          email,
          isVerify: !isPasswordRegister,
        }),
      );

      if (isPasswordRegister) {
        const { password } = dto;
        await manager.save(
          this.passwordEntity.create({
            userId,
            password,
          }),
        );
      } else {
        const { provider, providerId } = dto;
        await manager.save(
          this.oauthProviderEntity.create({
            userId,
            provider,
            providerId,
          }),
        );
      }

      return user;
    });
  }

  public async generateEmailValidateToken(
    uuid: string,
  ): Promise<{ token: string; email: string }> {
    const user = await this.entity.findOneOrFail({
      select: ['id', 'email'],
      relations: ['email'],
      where: {
        uuid,
      },
    });

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

    return {
      token,
      email: user.email.email,
    };
  }

  public async validateEmail(dto: EmailValidateDto) {
    const { email: emailPo } = await this.entity.findOneOrFail({
      relations: ['email', 'email.validateTokens'],
      where: {
        email: {
          email: dto.email,
        },
      },
    });
    const { validateTokens } = emailPo;

    const tokenPo = validateTokens.find(
      (entity) =>
        entity.token === dto.token &&
        entity.isUsed === false &&
        entity.expiredAt >= new Date(),
    );

    if (undefined === tokenPo) {
      throw new EntityNotFoundError(this.emailValidateTokenEntity.target, '');
    }

    await getManager().transaction(async (manager) => {
      emailPo.isVerify = true;
      await manager.save(this.emailEntity.create(emailPo));
      tokenPo.isUsed = true;
      await manager.save(this.emailValidateTokenEntity.create(tokenPo));
    });
  }

  public findUserByEmail(
    email: string,
  ): Promise<
    Pick<User, 'id' | 'uuid' | 'name' | 'email' | 'password' | 'loginType'>
  > {
    return this.entity.findOneOrFail({
      select: ['id', 'uuid', 'name'],
      relations: ['email', 'password', 'loginType'],
      where: {
        email: {
          email,
        },
      },
    });
  }

  public findUserByUUID(
    uuid: string,
  ): Promise<Pick<User, 'id' | 'uuid' | 'name' | 'loginType' | 'password'>> {
    return this.entity.findOneOrFail({
      select: ['id', 'uuid', 'name'],
      relations: ['loginType', 'password'],
      where: {
        uuid,
      },
    });
  }

  public findUserByProvider(
    provider: Provider,
    providerId: string,
  ): Promise<Pick<User, 'id' | 'uuid' | 'name' | 'loginType'>> {
    return this.entity.findOneOrFail({
      select: ['id', 'uuid', 'name'],
      relations: ['loginType', 'oauthProvider'],
      where: {
        oauthProvider: {
          provider,
          providerId,
        },
      },
    });
  }

  public async updateUser(
    uuid: string,
    values: { name?: string; password?: string },
  ) {
    const user = await this.findUserByUUID(uuid);

    const { name, password } = values;

    if (name !== undefined) {
      user.name = name;
    }
    if (password !== undefined) {
      user.password.password = password;
    }

    return this.entity.save(user);
  }

  public async isEmailVerify(uuid: string): Promise<boolean> {
    try {
      await this.entity.findOneOrFail({
        relations: ['email'],
        where: {
          uuid,
          email: {
            isVerify: true,
          },
        },
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  public async isEmailRegistered(email: string): Promise<boolean> {
    try {
      await this.findWithEmail(email);

      return true;
    } catch (error) {
      return false;
    }
  }

  public async isOauthProviderIdRegistered(
    provider: Provider,
    providerId: string,
  ): Promise<boolean> {
    try {
      await this.entity.findOneOrFail({
        relations: ['oauthProvider'],
        where: {
          oauthProvider: {
            provider,
            providerId,
          },
        },
      });

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
