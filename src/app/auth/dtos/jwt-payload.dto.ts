import { LoginType } from '../../../database/entities';

export class JwtPayloadDto {
  readonly iss: string;

  readonly sub: string;

  readonly iat: number;

  // avoid expose primary id to leak implement detailed and data volume
  readonly uuid: string;

  readonly name: string;

  readonly email: string;

  readonly loginType: LoginType;

  readonly isVerify: boolean;
}
