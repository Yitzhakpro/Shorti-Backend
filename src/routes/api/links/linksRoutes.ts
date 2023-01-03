import config from '../../../config';
import { linksService } from '../../../services';
import { getShortUrlSchema, createShortUrlSchema, deleteShortUrlSchema } from './schemas';
import { IGetShortUrlQuerystring, ICreateShortUrlBody, IDeleteShortUrlParams } from './types';
import type { DecodedAuthToken } from '../../../types';
import type { FastifyPluginAsync } from 'fastify';

const clientOrigin = config.get('cors.origin');

const linksRoutes: FastifyPluginAsync = async (fastify, _options) => {
  fastify.get<{ Querystring: IGetShortUrlQuerystring }>(
    '/getShortUrl',
    { schema: getShortUrlSchema },
    async (request, reply) => {
      const { linkId } = request.query;

      const url = await linksService.getShortUrl(linkId);
      if (!url) {
        return reply.redirect(`${clientOrigin}/u/404`);
      }

      return reply.redirect(url);
    }
  );

  fastify.get('/getUrls', { preHandler: fastify.verifyUser }, async (request, _reply) => {
    const decodedToken = (await request.jwtVerify()) as DecodedAuthToken;

    const allUrls = await linksService.getUrls(decodedToken.id);

    return allUrls;
  });

  fastify.post<{ Body: ICreateShortUrlBody }>(
    '/createShortUrl',
    { schema: createShortUrlSchema, preHandler: fastify.verifyUser },
    async (request, _reply) => {
      const { fullUrl } = request.body;
      const decodedToken = (await request.jwtVerify()) as DecodedAuthToken;

      const urlObject = await linksService.createShortUrl(fullUrl, decodedToken.id);

      return urlObject;
    }
  );

  fastify.delete<{ Params: IDeleteShortUrlParams }>(
    '/deleteShortUrl/:id',
    {
      schema: deleteShortUrlSchema,
      preHandler: fastify.verifyUser,
    },
    async (request, _reply) => {
      const { id } = request.params;
      const decodedToken = (await request.jwtVerify()) as DecodedAuthToken;

      await linksService.deleteShortUrl(id, decodedToken.id);

      return 'Ok';
    }
  );
};

export default linksRoutes;
