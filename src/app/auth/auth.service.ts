import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtPayloadDto } from './dtos/jwt-payload.dto';
import { UserRepository } from '../user/user.repository';
import { User } from '../../database/entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {}

  public validatePassword(input: string, hash: string): Promise<boolean> {
    return bcrypt.compare(input, hash);
  }

  public decodeJwt(token: string): JwtPayloadDto {
    return <JwtPayloadDto>this.jwtService.decode(token);
  }

  public async generateAccessToken(
    user: Pick<User, 'uuid' | 'name' | 'email' | 'loginType'>,
  ) {
    const {
      uuid,
      name,
      email: { email },
      loginType: { type: loginType },
    } = user;

    const payload: JwtPayloadDto = {
      iss: this.configService.get('JWT_ISSUER'),
      sub: this.configService.get('JWT_SUBJECT'),
      iat: new Date().getTime(),
      uuid,
      name,
      email,
      loginType,
      isVerify: await this.userRepository.isEmailVerify(uuid),
    };

    return this.jwtService.sign(payload);
  }
}
