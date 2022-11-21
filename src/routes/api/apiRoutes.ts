import shortenerRoutes from './shortenerRoutes';
import type { FastifyPluginAsync } from 'fastify';

const apiRoutes: FastifyPluginAsync = async (fastify, _options) => {
  fastify.register(shortenerRoutes, { prefix: '/' });
};

export default apiRoutes;
