import { IsUrl, MinLength, MaxLength, NotContains } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { User } from './User';
import type { GetUrlInfoReturn } from './types';

@Entity({ name: 'urls' })
export class Url extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @IsUrl({ protocols: ['http', 'https'] })
  fullUrl!: string;

  @Column()
  @MinLength(1)
  @MaxLength(30)
  @NotContains(' ')
  linkId!: string;

  @Column()
  views!: number;

  @Column({ nullable: true })
  userId!: string;

  @ManyToOne(() => User)
  user!: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  getUrlInfo(): GetUrlInfoReturn {
    return {
      id: this.id,
      fullUrl: this.fullUrl,
      linkId: this.linkId,
      views: this.views,
      createdAt: this.created_at,
    };
  }
}
