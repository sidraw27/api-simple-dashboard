import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiCookieAuth, ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { OauthGuard, LocalGuard, JwtGuard } from './guards';
import Provider = Auth.Provider;
import { JwtPayloadDto } from './dtos/jwt-payload.dto';
import { UserFacade } from '../user/user.facade';
import { EmailValidateDto } from '../user/dtos';
import { StatisticsService } from '../../statistics/statistics.service';

@ApiTags('auth')
@Controller()
export class AuthController {
  private LOGIN_COOKIE = 'jwt';

  private LOGIN_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
  };

  constructor(
    private readonly service: AuthService,
    private readonly userFacade: UserFacade,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly statisticService: StatisticsService,
  ) {}

  @ApiCookieAuth()
  @Post('')
  @UseGuards(JwtGuard)
  public async reAuth(@Req() req, @Res() res) {
    const {
      user: { accessToken, uuid },
    } = req;

    await this.statisticService.recordActive(uuid);

    return this.setJwt(res, accessToken)
      .status(HttpStatus.OK)
      .json({ data: { accessToken } });
  }

  @Post('login')
  @UseGuards(LocalGuard)
  public async login(@Req() req, @Res() res) {
    const accessToken = await this.service.generateAccessToken(req.user);

    await this.statisticService.recordLogin(req.user.uuid);

    return this.setJwt(res, accessToken)
      .status(HttpStatus.OK)
      .json({ data: 'ok' });
  }

  @ApiCookieAuth()
  @Post('resend-validate-email')
  @UseGuards(JwtGuard)
  public async resendValidateEmail(@Req() req, @Res() res) {
    const jwtToken = req.cookies.jwt;

    const payload = <JwtPayloadDto>this.service.decodeJwt(jwtToken);

    if (payload.isVerify) {
      throw new HttpException('Has Verified', HttpStatus.BAD_REQUEST);
    }

    const { uuid } = payload;

    await this.userFacade.sendValidateMail(uuid);

    return res.status(HttpStatus.OK).json({ data: 'ok' });
  }

  @ApiBody({
    type: EmailValidateDto,
  })
  @Patch('validate-email')
  public async validateEmail(@Body() dto: EmailValidateDto, @Res() res) {
    try {
      await this.userService.validateEmail(dto);
      const user = await this.userService.findUserByEmail(dto.email);

      const accessToken = await this.service.generateAccessToken(user);

      return this.setJwt(res, accessToken)
        .status(HttpStatus.OK)
        .json({ data: 'ok' });
    } catch (error) {
      throw new HttpException('validate failed', HttpStatus.FORBIDDEN);
    }
  }

  @ApiOAuth2(['email'])
  @Get(':provider')
  @UseGuards(OauthGuard)
  public async oauth(@Param() provider: Provider) {
    Logger.log(`${provider} login`);
  }

  @ApiOAuth2(['email'])
  @Get(':provider/callback')
  @UseGuards(OauthGuard)
  public async callback(
    @Param('provider') provider: Provider,
    @Req() req,
    @Res() res,
  ) {
    try {
      const accessToken = await this.service.generateAccessToken(req.user);

      await this.statisticService.recordLogin(req.user.uuid);

      return this.setJwt(res, accessToken).redirect(
        this.configService.get('APP_URL'),
      );
    } catch (error) {
      throw new HttpException('Please report.', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiCookieAuth()
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
