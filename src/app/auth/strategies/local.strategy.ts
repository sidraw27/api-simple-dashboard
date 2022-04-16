import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super({
      usernameField: 'email',
    });
  }

  async validate(username: string, password: string) {
    let user;

    try {
      user = await this.userService.findUserByEmail(username);
    } catch (error) {
      Logger.error(error);
      throw new UnauthorizedException();
    }

    const isPass = await this.authService.validatePassword(
      password,
      user.password.password,
    );

    if (!isPass) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
