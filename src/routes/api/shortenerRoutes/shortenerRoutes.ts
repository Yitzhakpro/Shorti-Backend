import type { IShortenerMainParams } from './types';
import type { FastifyPluginAsync } from 'fastify';

const shortenerRoutes: FastifyPluginAsync = async (fastify, _options) => {
  fastify.get<{ Params: IShortenerMainParams }>('/:routeID', async (request, reply) => {
    // eslint-disable-next-line no-empty-pattern
    const { routeID } = request.params;
    console.log(routeID);

    return reply.redirect('https://google.com');
  });
};

export default shortenerRoutes;
