import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import type { User } from './user';

export enum Provider {
  GOOGLE,
  FACEBOOK,
}

@Entity('user_oauth_providers')
@Index(['provider', 'providerId'], { unique: true })
export class UserOauthProvider {
  @PrimaryColumn()
  userId: number;

  @Column({ type: 'enum', enum: Provider })
  provider: Provider;

  @Column()
  providerId: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @OneToOne<User>('User', (user) => user.oauthProvider)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
