import { PasswordRegisterDto } from './password-register.dto';

export * from './password-register.dto';
export * from './email-validate.dto';
export * from './oauth-register.dto';

export function isPasswordRegisterDto<T>(
  dto: PasswordRegisterDto | T,
): dto is PasswordRegisterDto {
  return (dto as PasswordRegisterDto).password !== undefined;
}
