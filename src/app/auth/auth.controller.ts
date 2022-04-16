import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { OauthGuard, LocalGuard, JwtGuard } from './guards';
import Provider = Auth.Provider;

@Controller()
export class AuthController {
  private LOGIN_COOKIE = 'jwt';

  private LOGIN_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
  };

  constructor(
    private readonly service: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Post('')
  @UseGuards(JwtGuard)
  public async reAuth(@Req() req, @Res() res) {
    const {
      user: { accessToken },
    } = req;

    return this.setJwt(res, accessToken)
      .status(HttpStatus.OK)
      .json({ data: { accessToken } });
  }

  @Post('login')
  @UseGuards(LocalGuard)
  public async login(@Req() req, @Res() res) {
    const accessToken = await this.service.generateAccessToken(req.user);

    return this.setJwt(res, accessToken)
      .status(HttpStatus.OK)
      .json({ data: 'ok' });
  }

  @Get(':provider')
  @UseGuards(OauthGuard)
  public async oauth(@Param() provider: Provider) {
    Logger.log(`${provider} login`);
  }

  @Get(':provider/callback')
  @UseGuards(OauthGuard)
  public async callback(
    @Param('provider') provider: Provider,
    @Req() req,
    @Res() res,
  ) {
    try {
      const accessToken = await this.service.generateAccessToken(req.user);

      return this.setJwt(res, accessToken).redirect(
        this.configService.get('APP_URL'),
      );
    } catch (error) {
      throw new HttpException('Please report.', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  public async logout(@Res() res) {
    res.clearCookie(this.LOGIN_COOKIE, this.LOGIN_COOKIE_OPTIONS);

    return res.status(HttpStatus.OK).json({ data: 'ok' });
  }

  private setJwt(res, accessToken) {
    res.cookie(this.LOGIN_COOKIE, accessToken, this.LOGIN_COOKIE_OPTIONS);

    return res;
  }
}
