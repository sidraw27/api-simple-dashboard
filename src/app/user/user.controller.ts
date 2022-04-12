import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import { UserFacade } from './user.facade';
import { UserService } from './user.service';
import { PasswordRegisterDto } from './dtos';
import { HasRegisteredException } from './exceptions';

@Controller()
export class UserController {
  constructor(
    private readonly facade: UserFacade,
    private readonly service: UserService,
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
}
