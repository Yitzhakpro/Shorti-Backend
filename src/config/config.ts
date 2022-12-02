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
      default: 'http://localhost:5173',
      env: 'CLIENT_ORIGIN',
    },
    credentials: {
      doc: 'Cors with credentials',
      default: true,
      env: 'CORS_CREDENTIALS',
    },
  },
  auth: {
    fastifyJwtOptions: {
      cookie: {
        cookieName: {
          doc: 'The name of the cookie',
          default: 'authToken',
          env: 'AUTH_TOKEN_NAME',
        },
        signed: {
          doc: 'Whether or not the cookie is signed',
          default: false,
          env: 'AUTH_TOKEN_IS_SIGNED',
        },
      },
      secret: {
        doc: 'secret of the token',
        default: 'short_auth',
        env: 'AUTH_TOKEN_SECRET',
      },
    },
    tokenOptions: {
      expiresIn: {
        doc: 'expire of jwt token',
        default: '1d',
      },
    },
    cookieOptions: {
      httpOnly: {
        doc: 'http only cookie',
        default: true,
      },
      path: {
        doc: 'path of cookie',
        default: '/',
      },
      sameSite: {
        default: true,
      },
      maxAge: {
        doc: 'max age of cookie',
        default: 86_400, // 1 day
      },
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
