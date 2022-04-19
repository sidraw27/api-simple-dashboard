import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { IsOptional, Matches } from 'class-validator';
import { OauthRegisterDto } from './oauth-register.dto';
import { passwordRegex, PasswordRegisterDto } from './password-register.dto';

export class UserPatchDto extends PartialType(
  IntersectionType(
    PickType(OauthRegisterDto, ['name']),
    PickType(PasswordRegisterDto, ['password', 'passwordConfirmation']),
  ),
) {
  @IsOptional()
  @Matches(passwordRegex, { message: 'old password not correct' })
  readonly oldPassword: string;
}
