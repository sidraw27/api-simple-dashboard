import { IsDefined, Length } from 'class-validator';
import { PickType } from '@nestjs/mapped-types';
import { PasswordRegisterDto } from './password-register.dto';

export class EmailValidateDto extends PickType(PasswordRegisterDto, ['email']) {
  @IsDefined()
  @Length(32, 32)
  readonly token: string;
}
