import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastify from 'fastify';
import config from './config';
import { dbConnections } from './plugins';
import rootRoutes from './routes';
import type { FastifyInstance } from 'fastify';

const corsConfig = config.get('cors');
const fastifyJwtConfig = config.get('auth.fastifyJwtOptions');

const createServer = (): FastifyInstance => {
  const server = fastify({ logger: true });

  // fastify ecosystem
  server.register(fastifyCors, corsConfig);
  server.register(fastifyCookie);
  server.register(fastifyJwt, fastifyJwtConfig);
  // my plugins
  server.register(dbConnections);
  // decorators
  // hooks
  // my services
  server.register(rootRoutes);

  return server;
};

export default createServer;
