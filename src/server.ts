import fastify from 'fastify';
import type { FastifyInstance } from 'fastify';

const createServer = (): FastifyInstance => {
  const server = fastify({ logger: true });

  return server;
};

export default createServer;
