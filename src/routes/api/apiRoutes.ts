import authRoutes from './auth';
import linksRoutes from './links';
import type { FastifyPluginAsync } from 'fastify';

const apiRoutes: FastifyPluginAsync = async (fastify, _options) => {
  fastify.register(authRoutes, { prefix: '/auth' });
  fastify.register(linksRoutes, { prefix: '/links' });
};

export default apiRoutes;
