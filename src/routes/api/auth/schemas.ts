import type { FastifySchema } from 'fastify';

// register route
const registerBody = {
  type: 'object',
  required: ['email', 'username', 'password'],
  properties: {
    email: { type: 'string' },
    username: { type: 'string' },
    password: { type: 'string' },
  },
};

export const registerSchema: FastifySchema = {
  body: registerBody,
};
