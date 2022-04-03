import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { UserEmail } from './user-email';
import type { UserOauthProvider } from './user-oauth-provider';
import type { UserLoginType } from './user-login-type';
import type { UserPassword } from './user-password';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'uuid',
    generated: 'uuid',
    comment: `use for hiding primary sequence.`,
  })
  @Index({ unique: true })
  uuid: string;

  @Column('varchar', { length: 20 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relations
  @OneToOne<UserLoginType>(
    'UserLoginType',
    (userLoginType) => userLoginType.user,
  )
  loginType: UserLoginType;

  @OneToOne<UserEmail>('UserEmail', (userEmail) => userEmail.user)
  email: UserEmail;

  @OneToOne<UserPassword>('UserPassword', (userPassword) => userPassword.user)
  password: UserPassword;

  @OneToOne<UserOauthProvider>(
    'UserOauthProvider',
    (userOauthProvider) => userOauthProvider.user,
  )
  oauthProvider: UserOauthProvider;
}
