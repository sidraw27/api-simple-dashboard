import { IsDefined, IsEmail, Matches } from 'class-validator';
import { Match } from '../../../decorator/validators';

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W][^\n\s]{8,40}$/;

export class PasswordRegisterDto {
  @IsDefined()
  @IsEmail()
  readonly email: string;

  @IsDefined()
  @Matches(passwordRegex, { message: 'password too weak' })
  readonly password: string;

  // eslint-disable-next-line no-use-before-define
  @Match(PasswordRegisterDto, (dto) => dto.password, {
    message: 'confirm password not match',
  })
  readonly passwordConfirmation: string;
}
