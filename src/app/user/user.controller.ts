import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PasswordRegisterDto } from './dtos';
import { HasRegisteredException } from './exceptions';

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('register')
  public async register(@Body() dto: PasswordRegisterDto, @Res() res) {
    try {
      await this.service.register(dto);

      return res.status(HttpStatus.OK).json({ data: 'ok' });
    } catch (error) {
      if (error instanceof HasRegisteredException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }

      throw new HttpException('Please report.', HttpStatus.BAD_REQUEST);
    }
  }
}
