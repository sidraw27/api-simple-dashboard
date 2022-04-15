import { BadRequestException, Injectable } from '@nestjs/common';
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

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

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
      const { id: providerId, displayName: name, emails } = dto;
      saveDto = <OauthRegisterDto>{
        provider,
        providerId,
        name,
        email: emails[0].value,
      };
      isRegistered = await this.userRepository.isOauthProviderIdRegistered(
        saveDto.provider,
        saveDto.providerId,
      );
    }

    if (isRegistered) {
      throw new HasRegisteredException();
    }

    await this.userRepository.createUser(saveDto);
  }

  public async generateValidateToken(email: string) {
    return this.userRepository.generateEmailValidateToken(email);
  }

  public validateEmail(dto: EmailValidateDto) {
    return this.userRepository.validateEmail(dto);
  }
}
