import bcrypt from 'bcrypt';
import { IsEmail, MinLength, MaxLength } from 'class-validator';
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
import { AUTH_ERROR_CODES, UnauthorizedError } from '../errorHandler';
import { hashString } from '../utils';
import { Url } from './Url';
import type { GetUserInfoReturn } from './types';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  @IsEmail()
  email!: string;

  @Column({ unique: true })
  @MinLength(1)
  @MaxLength(20)
  username!: string;

  @Column()
  @MinLength(8)
  @MaxLength(16)
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
    } catch (error) {
      throw new UnauthorizedError(
        'userModal',
        "Can't compare password with hased password",
        AUTH_ERROR_CODES.WRONG_CREDENTIALS_ERROR,
        {
          email: this.email,
          error,
        }
      );
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
