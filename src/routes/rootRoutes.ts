import apiRoutes from './api';
import { shortenerRootSchema } from './schemas';
import type { IShortenerRouteParam } from './types';
import type { FastifyPluginAsync } from 'fastify';

const rootRoutes: FastifyPluginAsync = async (fastify, _options) => {
  fastify.get<{ Params: IShortenerRouteParam }>(
    '/:routeID',
    { schema: shortenerRootSchema },
    async (request, response) => {
      const { routeID } = request.params;
      if (routeID) {
        return response.redirect('https://www.google.com');
      }

      return 'no route id';
    }
  );

  fastify.register(apiRoutes, { prefix: '/api' });
};

export default rootRoutes;
