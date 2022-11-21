import fastifyCors from '@fastify/cors';
import fastify from 'fastify';
import config from './config';
import rootRoutes from './routes';
import type { FastifyInstance } from 'fastify';

const corsConfig = config.get('cors');

const createServer = (): FastifyInstance => {
  const server = fastify({ logger: true });

  // fastify ecosystem
  server.register(fastifyCors, corsConfig);
  // my plugins
  // decorators
  // hooks
  // my services
  server.register(rootRoutes);

  return server;
};

export default createServer;
