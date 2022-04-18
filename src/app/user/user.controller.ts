import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { UserFacade } from './user.facade';
import { UserService } from './user.service';
import { PasswordRegisterDto, EmailValidateDto } from './dtos';
import { AuthService } from '../auth/auth.service';
import { HasRegisteredException } from './exceptions';

@Controller()
export class UserController {
  constructor(
    private readonly facade: UserFacade,
    private readonly service: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  public async register(@Body() dto: PasswordRegisterDto, @Res() res) {
    try {
      await this.service.register(dto);
      await this.facade.sendValidateMail(dto.email);

      return res.status(HttpStatus.OK).json({ data: 'ok' });
    } catch (error) {
      if (error instanceof HasRegisteredException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }

      Logger.error(error);
      throw new HttpException('Please report.', HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('validate-email')
  public async validateEmail(@Body() dto: EmailValidateDto, @Res() res) {
    try {
      await this.service.validateEmail(dto);
      const user = await this.service.findUserByEmail(dto.email);

      const accessToken = await this.authService.generateAccessToken(user);

      return res.status(HttpStatus.OK).json({ data: { accessToken } });
    } catch (error) {
      throw new HttpException('validate failed', HttpStatus.FORBIDDEN);
    }
  }
}
