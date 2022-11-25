import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Urls' })
export class Url {
  @PrimaryGeneratedColumn('uuid')
  id!: string | undefined;

  @Column()
  fullUrl!: string;

  @Column()
  linkId!: string;

  @Column()
  views!: number;

  @Column()
  createdBy!: string;
}
