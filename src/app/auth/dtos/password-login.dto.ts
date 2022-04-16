import { PickType } from '@nestjs/mapped-types';
import { PasswordRegisterDto } from '../../user/dtos';

export class PasswordLoginDto extends PickType(PasswordRegisterDto, [
  'email',
  'password',
]) {}
