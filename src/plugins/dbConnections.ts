import fastifyPlugin from 'fastify-plugin';
import { postgresConnection } from '../connections';
import { InternalServerError } from '../errorHandler';
import type { FastifyPluginAsync } from 'fastify';

const dbConnections: FastifyPluginAsync = async (_fastify, _options) => {
  try {
    await postgresConnection.initialize();
  } catch (error) {
    throw new InternalServerError('dbConnection', "Can't connect to databases", { error });
  }
};

export default fastifyPlugin(dbConnections);
