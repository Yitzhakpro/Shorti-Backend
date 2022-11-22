import type { FastifySchema } from 'fastify';

// get short url route
const getShortUrlParams = {
  type: 'object',
  required: ['linkID'],
  properties: {
    linkID: { type: 'string' },
  },
};

export const getShortUrlSchema: FastifySchema = {
  params: getShortUrlParams,
};
