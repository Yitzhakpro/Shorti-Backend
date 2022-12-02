import { linksService } from '../../../services';
import { getShortUrlSchema, createShortUrlSchema } from './schemas';
import { IGetShortUrlParams, ICreateShortUrlBody } from './types';
import type { FastifyPluginAsync } from 'fastify';

const linksRoutes: FastifyPluginAsync = async (fastify, _options) => {
  fastify.get<{ Params: IGetShortUrlParams }>(
    '/getShortUrl/:linkId',
    { schema: getShortUrlSchema },
    async (request, reply) => {
      const { linkId } = request.params;

      const url = await linksService.getShortUrl(linkId);

      return reply.redirect(url);
    }
  );

  fastify.post<{ Body: ICreateShortUrlBody }>(
    '/createShortUrl',
    { schema: createShortUrlSchema },
    async (request, _reply) => {
      const { fullUrl } = request.body;

      const urlObject = await linksService.createShortUrl(fullUrl);

      return urlObject;
    }
  );
};

export default linksRoutes;
