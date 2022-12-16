import fastifyPlugin from 'fastify-plugin';
import { postgresConnection } from '../connections';
import { InternalServerError, SERVER_ERROR_CODES } from '../errorHandler';
import type { FastifyPluginAsync } from 'fastify';

const dbConnections: FastifyPluginAsync = async (_fastify, _options) => {
  try {
    await postgresConnection.initialize();
  } catch (error) {
    throw new InternalServerError(
      'dbConnection',
      "Can't connect to databases",
      SERVER_ERROR_CODES.DB_CONNECTION_ERROR,
      { error }
    );
  }
};

export default fastifyPlugin(dbConnections);
