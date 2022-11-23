import type { FastifySchema } from 'fastify';

// get short url route
const getShortUrlParams = {
  type: 'object',
  required: ['linkId'],
  properties: {
    linkId: { type: 'string' },
  },
};

export const getShortUrlSchema: FastifySchema = {
  params: getShortUrlParams,
};
