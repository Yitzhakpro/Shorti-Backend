import type { FastifySchema } from 'fastify';

// login route
const loginBody = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
  },
};

export const loginSchema: FastifySchema = {
  body: loginBody,
};

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
