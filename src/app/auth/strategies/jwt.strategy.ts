import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { Validate } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDto } from '../dtos/jwt-payload.dto';
import { afterMinutes } from '../../util/date/date-helper';
import { UserRepository } from '../../user/user.repository';
import { AuthService } from '../auth.service';

let forceRefresh = false;

const extractFromCookie = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.jwt;
    forceRefresh = req.body.forceRefresh ?? false;
  }
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: extractFromCookie,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  @Validate(JwtPayloadDto)
  public async validate(
    payload: JwtPayloadDto,
  ): Promise<{ accessToken: string; uuid: string }> {
    const { sub, iss, iat, uuid } = payload;
    let accessToken;

    if (forceRefresh || afterMinutes(-5).getTime() > iat) {
      try {
        const user = await this.userRepository.findUserByUUID(uuid);
        accessToken = await this.authService.generateAccessToken(user);
      } catch (error) {
        Logger.error(error);
        throw new UnauthorizedException();
      }
    } else {
      accessToken = this.jwtService.sign(payload);
    }

    if (
      sub !== this.configService.get('JWT_SUBJECT') ||
      iss !== this.configService.get('JWT_ISSUER')
    ) {
      throw new UnauthorizedException();
    }

    return { accessToken, uuid };
  }
}
