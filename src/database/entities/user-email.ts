import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { User } from './user';
import type { UserEmailValidateToken } from './user-email-validate-token';

@Entity('user_emails')
export class UserEmail {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  userId: number;

  /**
   * path
   *    The maximum total length of a reverse-path or forward-path is 256
   *    characters (including the punctuation and element separators).
   * e.g. Path = <[ A-d-l ":" ] Mailbox>
   *
   * ref: https://www.ietf.org/rfc/rfc2821.txt
   */
  @Column({ length: 254, comment: 'https://www.ietf.org/rfc/rfc2821.txt' })
  @Index({ unique: true })
  email: string;

  @Column()
  isVerify: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relations
  @OneToOne<User>('User', (user) => user.email)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany<UserEmailValidateToken>(
    'UserEmailValidateToken',
    (userEmailValidateToken) => userEmailValidateToken.email,
  )
  validateTokens: UserEmailValidateToken[];
}
