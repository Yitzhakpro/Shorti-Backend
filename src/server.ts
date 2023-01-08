import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastify from 'fastify';
import config from './config';
import { fastifyErrorHandler } from './errorHandler';
import { dbConnections, verifyUser } from './plugins';
import rootRoutes from './routes';
import type { Enviroment } from './types';
import type { FastifyInstance } from 'fastify';

const env = config.get('env') as Enviroment;
const corsConfig = config.get('cors');
const fastifyJwtConfig = config.get('auth.fastifyJwtOptions');

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'SYS:HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
};

const createServer = (): FastifyInstance => {
  const logger = envToLogger[env] ?? true;
  const server = fastify({ logger });

  // fastify ecosystem
  server.register(fastifyCors, corsConfig);
  server.register(fastifyCookie);
  server.register(fastifyJwt, fastifyJwtConfig);
  // my plugins
  server.register(dbConnections);
  server.register(verifyUser);
  // decorators
  // hooks
  // my services
  server.register(rootRoutes);

  server.setErrorHandler(fastifyErrorHandler);

  return server;
};

export default createServer;
