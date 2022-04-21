import {
  IsDefined,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { PasswordRegisterDto } from './password-register.dto';
import { Provider } from '../../../database/entities';

export class OauthRegisterDto extends PickType(PasswordRegisterDto, ['email']) {
  @ApiProperty()
  @IsDefined()
  @IsEnum(Provider)
  readonly provider: Provider;

  @ApiProperty()
  @IsDefined()
  @IsString()
  readonly providerId: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  readonly name: string;
}
