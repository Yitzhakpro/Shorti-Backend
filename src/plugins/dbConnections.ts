import fastifyPlugin from 'fastify-plugin';
import { postgresConnection } from '../connections';
import type { FastifyPluginAsync } from 'fastify';

const dbConnections: FastifyPluginAsync = async (_fastify, _options) => {
  try {
    await postgresConnection.initialize();
  } catch (error) {
    console.error(error);
    throw new Error('db connection error');
  }
};

export default fastifyPlugin(dbConnections);
