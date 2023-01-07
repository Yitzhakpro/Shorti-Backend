import config from '../../../config';
import { linksService } from '../../../services';
import { getShortUrlSchema, createShortUrlSchema, deleteShortUrlSchema, renameShortUrlSchema } from './schemas';
import { IGetShortUrlQuerystring, ICreateShortUrlBody, IDeleteShortUrlParams, IRenameShortUrlBody } from './types';
import type { DecodedAuthToken } from '../../../types';
import type { FastifyPluginAsync } from 'fastify';

const clientOrigin = config.get('cors.origin');

const linksRoutes: FastifyPluginAsync = async (fastify, _options) => {
  fastify.get<{ Querystring: IGetShortUrlQuerystring }>(
    '/getShortUrl',
    { schema: getShortUrlSchema },
    async (request, reply) => {
      const { linkId } = request.query;
      const formatedLinkId = linkId.startsWith('/') ? linkId.slice(1) : linkId;

      const url = await linksService.getShortUrl(formatedLinkId);
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
      const { fullUrl, linkName } = request.body;
      const decodedToken = (await request.jwtVerify()) as DecodedAuthToken;

      const urlObject = await linksService.createShortUrl(fullUrl, decodedToken.id, linkName);

      return urlObject;
    }
  );

  fastify.post<{ Body: IRenameShortUrlBody }>(
    '/renameShortUrl',
    { schema: renameShortUrlSchema, preHandler: fastify.verifyUser },
    async (request, _reply) => {
      const { id, linkName } = request.body;
      const decodedToken = (await request.jwtVerify()) as DecodedAuthToken;

      await linksService.renameShortUrl(id, linkName, decodedToken.id);
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
