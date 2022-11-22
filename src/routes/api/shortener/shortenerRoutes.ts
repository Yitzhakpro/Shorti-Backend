import { getShortUrlSchema } from './schemas';
import { IGetShortUrlParams } from './types';
import type { FastifyPluginAsync } from 'fastify';

const shortenerRoutes: FastifyPluginAsync = async (fastify, _options) => {
  fastify.get<{ Params: IGetShortUrlParams }>(
    '/getShortUrl/:linkID',
    { schema: getShortUrlSchema },
    async (request, _reply) => {
      const { linkID } = request.params;

      return linkID;
    }
  );
};

export default shortenerRoutes;
