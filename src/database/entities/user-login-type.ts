import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import type { User } from './user';

export enum LoginType {
  PASSWORD,
  OAUTH,
}

@Entity('user_login_types')
export class UserLoginType {
  @PrimaryColumn()
  userId: number;

  @Column({ type: 'enum', enum: LoginType })
  type: LoginType;

  // Relations
  @OneToOne<User>('User', (user) => user.loginType)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
