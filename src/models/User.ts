import bcrypt from 'bcrypt';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { hashString } from '../utils';
import { Url } from './Url';
import type { GetUserInfoReturn } from './types';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @OneToMany(() => Url, (url) => url.user)
  urls!: Url[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @BeforeInsert()
  async onCreateUser(): Promise<void> {
    this.password = await hashString(this.password);
  }

  async comparePassword(triedPassword: string): Promise<boolean> {
    try {
      const isCorrectPassword = await bcrypt.compare(triedPassword, this.password);

      return isCorrectPassword;
    } catch (err) {
      throw new Error('wrong credentials');
    }
  }

  getUserInfo(): GetUserInfoReturn {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
    };
  }
}