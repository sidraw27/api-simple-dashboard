import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { User } from './user';

@Entity('user_passwords')
export class UserPassword {
  @PrimaryColumn()
  userId: number;

  @Column({
    type: 'char',
    length: '60',
    comment: 'use bcrypt algorithms to hashing, salt rounds 10.',
  })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne<User>('User', (user) => user.password)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
