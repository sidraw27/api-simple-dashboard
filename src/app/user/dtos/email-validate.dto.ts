import { IsDefined, Length } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { PasswordRegisterDto } from './password-register.dto';

export class EmailValidateDto extends PickType(PasswordRegisterDto, ['email']) {
  @ApiProperty()
  @IsDefined()
  @Length(32, 32)
  readonly token: string;
}
