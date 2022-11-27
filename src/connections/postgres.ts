import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from '../config';
import { Url, User } from '../models';

const postgresConfig = config.get('db.postgres');

const postgresConnection = new DataSource({
  ...postgresConfig,
  type: 'postgres',
  entities: [Url, User],
  synchronize: false,
  logging: false,
});

export default postgresConnection;
