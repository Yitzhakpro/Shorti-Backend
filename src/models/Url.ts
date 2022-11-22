import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Url {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  fullUrl!: string;

  @Column()
  linkID!: string;

  @Column()
  views!: number;

  @Column()
  createdBy!: string;
}
