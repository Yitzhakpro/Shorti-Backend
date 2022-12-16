import config from '../../../config';
import { linksService } from '../../../services';
import { getShortUrlSchema, createShortUrlSchema } from './schemas';
import { IGetShortUrlParams, ICreateShortUrlBody } from './types';
import type { FastifyPluginAsync } from 'fastify';

const clientOrigin = config.get('cors.origin');

const linksRoutes: FastifyPluginAsync = async (fastify, _options) => {
  fastify.get<{ Params: IGetShortUrlParams }>(
    '/getShortUrl/:linkId',
    { schema: getShortUrlSchema },
    async (request, reply) => {
      const { linkId } = request.params;

      const url = await linksService.getShortUrl(linkId);
      if (!url) {
        return reply.redirect(`${clientOrigin}/u/404`);
      }

      return reply.redirect(url);
    }
  );

  fastify.get('/getUrls', { preHandler: fastify.verifyUser }, async (request, _reply) => {
    const decodedToken = (await request.jwtVerify()) as { id: string; email: string; username: string };

    const allUrls = await linksService.getUrls(decodedToken.id);

    return allUrls;
  });

  fastify.post<{ Body: ICreateShortUrlBody }>(
    '/createShortUrl',
    { schema: createShortUrlSchema, preHandler: fastify.verifyUser },
    async (request, _reply) => {
      const { fullUrl } = request.body;
      const decodedToken = (await request.jwtVerify()) as { id: string; email: string; username: string };

      const urlObject = await linksService.createShortUrl(fullUrl, decodedToken.id);

      return urlObject;
    }
  );
};

export default linksRoutes;
