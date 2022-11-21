import type { FastifySchema } from 'fastify';

// root shortener url
const shortenerRootParams = {
  type: 'object',
  properties: {
    routeID: { type: 'string' },
  },
};

export const shortenerRootSchema: FastifySchema = {
  params: shortenerRootParams,
};
