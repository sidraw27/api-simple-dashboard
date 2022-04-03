import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { UserEmail } from './user-email';

@Entity('user_email_validate_tokens')
export class UserEmailValidateToken {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  @Index()
  userEmailId: number;

  @Column('char', { length: 32, comment: 'hash' })
  token: string;

  @Column('boolean', { default: false })
  isUsed: boolean;

  @Column('timestamp')
  expiredAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne<UserEmail>('UserEmail', (userEmail) => userEmail.validateTokens)
  @JoinColumn({ name: 'user_email_id' })
  email: UserEmail;
}
