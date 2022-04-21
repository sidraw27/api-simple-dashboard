import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserFacade } from './user.facade';
import { UserService } from './user.service';
import { PasswordRegisterDto, UserPatchDto } from './dtos';
import { HasRegisteredException } from './exceptions';
import { JwtGuard } from '../auth/guards';
import { StatisticsService } from '../../statistics/statistics.service';

@Controller()
export class UserController {
  constructor(
    private readonly facade: UserFacade,
    private readonly service: UserService,
    private readonly statisticsService: StatisticsService,
  ) {}

  @Get('statistics')
  @UseGuards(JwtGuard)
  public async getStatistics(@Res() res) {
    const statistics = await this.statisticsService.getUserStatistics();

    return res.status(HttpStatus.OK).json({ data: statistics });
  }

  @Get('')
  @UseGuards(JwtGuard)
  public async getList(@Query() query, @Res() res) {
    const users = await this.service.getUsersInfo(query.page ?? 1);

    return res.status(HttpStatus.OK).json({ data: users });
  }

  @Post('register')
  public async register(@Body() dto: PasswordRegisterDto, @Res() res) {
    try {
      await this.service.register(dto);

      return res.status(HttpStatus.OK).json({ data: 'ok' });
    } catch (error) {
      if (error instanceof HasRegisteredException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }

      Logger.error(error);
      throw new HttpException('Please report.', HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':uuid')
  @UseGuards(JwtGuard)
  public async patchName(@Body() dto: UserPatchDto, @Req() req, @Res() res) {
    if (req.params.uuid !== req.user.uuid) {
      throw new HttpException('Incorrect privilege.', HttpStatus.FORBIDDEN);
    }

    await this.facade.patchUser(req.params.uuid, dto);

    return res.status(HttpStatus.OK).json({ message: 'ok' });
  }
}
