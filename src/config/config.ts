import fs from 'fs';
import path from 'path';
import convict from 'convict';
import * as dotenv from 'dotenv';

dotenv.config();

const config = convict({
  env: {
    doc: "The application's enviroment",
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  ip: {
    doc: 'IP address of server',
    default: '0.0.0.0',
    env: 'IP_ADDR',
  },
  port: {
    doc: 'Port that the server listen on',
    default: 8080,
    env: 'PORT',
  },
  cors: {
    origin: {
      doc: 'The origin for cors',
      default: 'http://localhost:3000',
      env: 'CLIENT_ORIGIN',
    },
    credentials: {
      doc: 'Cors with credentials',
      default: true,
      env: 'CORS_CREDENTIALS',
    },
  },
  db: {
    postgres: {
      host: {
        doc: 'IP of postgres',
        default: 'localhost',
        env: 'POSTGRES_HOST',
      },
      port: {
        doc: 'Port of postgres',
        default: 5432,
        env: 'POSTGRES_PORT',
      },
      database: {
        doc: 'database name of postgres',
        default: 'shortiPool',
        env: 'POSTGRES_DB_NAME',
      },
      username: {
        doc: 'username of postgres db',
        default: 'postgres',
        env: 'POSTGRES_USERNAME',
      },
      password: {
        doc: 'password of postgres db',
        default: 'password',
        env: 'POSTGRES_PASSWORD',
      },
    },
  },
});

const env = config.get('env');
const configFile = path.join(__dirname, `${env}.json`);
if (fs.existsSync(configFile)) {
  config.loadFile(configFile);
  console.log(`[V] Loaded ${env} config file successfully`);
}

export default config;
