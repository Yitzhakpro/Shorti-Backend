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

@Entity({ name: 'urls' })
export class Url extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  fullUrl!: string;

  @Column()
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
}
