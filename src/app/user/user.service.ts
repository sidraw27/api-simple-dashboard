import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PasswordRegisterDto, EmailValidateDto } from './dtos';
import { HasRegisteredException } from './exceptions';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async register(dto: PasswordRegisterDto) {
    const isRegistered = await this.userRepository.isEmailRegistered(dto.email);

    if (isRegistered) {
      throw new HasRegisteredException();
    }

    await this.userRepository.createUser(dto);
  }

  public async generateValidateToken(email: string) {
    return this.userRepository.generateEmailValidateToken(email);
  }

  public validateEmail(dto: EmailValidateDto) {
    return this.userRepository.validateEmail(dto);
  }
}
