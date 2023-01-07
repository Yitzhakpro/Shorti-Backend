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
  querystring: getShortUrlParams,
};

// create short url route
const createShortUrlBody = {
  type: 'object',
  required: ['fullUrl'],
  properties: {
    fullUrl: { type: 'string' },
    linkName: { type: 'string' },
  },
};

export const createShortUrlSchema: FastifySchema = {
  body: createShortUrlBody,
};

// rename short url route
const renameShortUrlBody = {
  type: 'object',
  required: ['id', 'linkName'],
  properties: {
    id: { type: 'string' },
    linkName: { type: 'string' },
  },
};

export const renameShortUrlSchema: FastifySchema = {
  body: renameShortUrlBody,
};

// delete short url route
const deleteShortUrlParams = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
  },
};

export const deleteShortUrlSchema: FastifySchema = {
  params: deleteShortUrlParams,
};
