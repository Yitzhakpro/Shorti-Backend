import shortenerRoutes from './shortener';
import type { FastifyPluginAsync } from 'fastify';

const apiRoutes: FastifyPluginAsync = async (fastify, _options) => {
  fastify.register(shortenerRoutes, { prefix: '/shortener' });
};

export default apiRoutes;
