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

// create short url route
const createShortUrlBody = {
  type: 'object',
  required: ['fullUrl'],
  properties: {
    fullUrl: { type: 'string' },
  },
};

export const createShortUrlSchema: FastifySchema = {
  body: createShortUrlBody,
};
