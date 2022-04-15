import {
  IsDefined,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PickType } from '@nestjs/mapped-types';
import { PasswordRegisterDto } from './password-register.dto';
import { Provider } from '../../../database/entities';

export class OauthRegisterDto extends PickType(PasswordRegisterDto, ['email']) {
  @IsDefined()
  @IsEnum(Provider)
  readonly provider: Provider;

  @IsDefined()
  @IsString()
  readonly providerId: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  readonly name: string;
}
