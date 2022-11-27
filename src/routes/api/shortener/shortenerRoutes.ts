import { shortenerService } from '../../../services';
import { getShortUrlSchema, createShortUrlSchema } from './schemas';
import { IGetShortUrlParams, ICreateShortUrlBody } from './types';
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

  fastify.post<{ Body: ICreateShortUrlBody }>(
    '/createShortUrl',
    { schema: createShortUrlSchema },
    async (request, _reply) => {
      const { fullUrl } = request.body;

      const urlObject = await shortenerService.createShortUrl(fullUrl);

      return urlObject;
    }
  );
};

export default shortenerRoutes;
