import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from '../config';
import { Url } from '../models';

const postgresConfig = config.get('db.postgres');

const postgresConnection = new DataSource({
  ...postgresConfig,
  type: 'postgres',
  entities: [Url],
  synchronize: false,
  logging: false,
});

export default postgresConnection;
