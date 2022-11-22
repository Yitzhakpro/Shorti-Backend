import apiRoutes from './api';
import type { FastifyPluginAsync } from 'fastify';

const rootRoutes: FastifyPluginAsync = async (fastify, _options) => {
  fastify.register(apiRoutes, { prefix: '/api' });
};

export default rootRoutes;
