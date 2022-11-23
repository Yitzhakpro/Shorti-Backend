import { shortenerService } from '../../../services';
import { getShortUrlSchema } from './schemas';
import { IGetShortUrlParams } from './types';
import type { FastifyPluginAsync } from 'fastify';

const shortenerRoutes: FastifyPluginAsync = async (fastify, _options) => {
  fastify.get<{ Params: IGetShortUrlParams }>(
    '/getShortUrl/:linkId',
    { schema: getShortUrlSchema },
    async (request, reply) => {
      const { linkId } = request.params;

      const url = await shortenerService.getShortUrl(linkId);

      return reply.redirect(url);
    }
  );
};

export default shortenerRoutes;
