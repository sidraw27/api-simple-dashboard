import {
  Controller,
  Get,
  Logger,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { OauthGuard } from './guards';
import Provider = Auth.Provider;

@Controller()
export class AuthController {
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
  ) {}
}
