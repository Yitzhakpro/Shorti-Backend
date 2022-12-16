import fastifyPlugin from 'fastify-plugin';
import * as yup from 'yup';
import config from '../config';
import { AUTH_TOKEN_ERROR_CODES, ForbiddenError } from '../errorHandler';
import { logger } from '../logger';
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    verifyUser: (_request: FastifyRequest, _reply: FastifyReply) => Promise<void>;
  }
}

const cookieName = config.get('auth.fastifyJwtOptions.cookie.cookieName');

const userDecodedSchema = yup.object().shape({
  id: yup.string().required(),
  email: yup.string().required(),
  username: yup.string().required(),
  iat: yup.number().required(),
  exp: yup.number().required(),
});

const verifyUser: FastifyPluginAsync = async (fastify, _options) => {
  fastify.decorate('verifyUser', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
      await userDecodedSchema.validate(request.user);
    } catch (error) {
      reply.clearCookie(cookieName);
      throw new ForbiddenError('VerifyUser', 'Bad auth token', AUTH_TOKEN_ERROR_CODES.BAD_TOKEN_ERROR, { error });
    }
  });
};

export default fastifyPlugin(verifyUser);
