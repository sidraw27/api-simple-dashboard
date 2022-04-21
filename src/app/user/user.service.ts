import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { UserRepository } from './user.repository';
import {
  isPasswordRegisterDto,
  PasswordRegisterDto,
  EmailValidateDto,
  OauthRegisterDto,
} from './dtos';
import { HasRegisteredException } from './exceptions';
import { Provider } from '../../database/entities';
import { ProviderProfileDto } from '../auth/dtos/provider-profile.dto';
import { Key } from '../../statistics/statistics.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRedis() private redis: Redis,
    private readonly userRepository: UserRepository,
  ) {}

  public async register(dto: PasswordRegisterDto);

  public async register(dto: ProviderProfileDto, provider: Provider);

  public async register(
    dto: PasswordRegisterDto | ProviderProfileDto,
    provider?: Provider,
  ) {
    const isPasswordRegister = isPasswordRegisterDto<ProviderProfileDto>(dto);

    if (isPasswordRegister && undefined !== provider) {
      throw new BadRequestException();
    }

    let isRegistered;
    let saveDto;

    if (isPasswordRegister) {
      saveDto = dto;
      isRegistered = await this.userRepository.isEmailRegistered(saveDto.email);
    } else {
      const {
        id: providerId,
        displayName: name,
        emails: [{ value: email }],
      } = dto;
      saveDto = <OauthRegisterDto>{
        provider,
        providerId,
        name,
        email,
      };
      isRegistered = await this.userRepository.isOauthProviderIdRegistered(
        saveDto.provider,
        saveDto.providerId,
      );
    }

    if (isRegistered) {
      throw new HasRegisteredException();
    }

    return this.userRepository.createUser(saveDto);
  }

  public async getUsersInfo(page: number) {
    const size = 10;
    const skip = (page - 1) * size;

    const users = await this.userRepository.findUserPagination(size, skip);

    return Promise.all(
      users.map(async (user) => {
        const {
          uuid,
          name,
          email: { email },
        } = user;

        const lastSessionTime = Number(
          await this.redis.zscore(Key.lastSessionTime, uuid),
        );
        const lastSession =
          lastSessionTime === 0 ? '-' : new Date(lastSessionTime).toUTCString();
        const loginTimes = Number(
          await this.redis.zscore(Key.loginTimes, uuid),
        );

        return {
          name,
          email,
          lastSession,
          loginTimes,
        };
      }),
    );
  }

  public patchUserName(uuid: string, name: string) {
    return this.userRepository.updateUser(uuid, { name: name.trim() });
  }

  public patchPassword(uuid: string, password: string) {
    return this.userRepository.updateUser(uuid, { password });
  }

  public findUserByUUID(uuid: string) {
    return this.userRepository.findUserByUUID(uuid);
  }

  public findUserByEmail(email: string) {
    return this.userRepository.findUserByEmail(email);
  }

  public findUserByProvider(provider: Provider, providerId: string) {
    return this.userRepository.findUserByProvider(provider, providerId);
  }

  public generateValidateToken(uuid: string) {
    return this.userRepository.generateEmailValidateToken(uuid);
  }

  public validateEmail(dto: EmailValidateDto) {
    return this.userRepository.validateEmail(dto);
  }
}
