import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-google-oauth20';
import { UserService } from '../../user/user.service';
import { HasRegisteredException } from '../../user/exceptions';
import { Provider } from '../../../database/entities';
import { ProviderProfileDto } from '../dtos/provider-profile.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      scope: ['email', 'profile'],
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URI'),
    });
  }

  public async validate(
    accessToken,
    refreshToken,
    profile: ProviderProfileDto,
  ) {
    let user;

    try {
      user = await this.userService.register(profile, Provider.GOOGLE);
    } catch (error) {
      const hasRegistered = error instanceof HasRegisteredException;

      if (!hasRegistered) {
        Logger.error(error);
        throw error;
      } else {
        user = await this.userService.findUserByProvider(
          Provider.GOOGLE,
          profile.id,
        );
      }
    }

    return user;
  }
}
