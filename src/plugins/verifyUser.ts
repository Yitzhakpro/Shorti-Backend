import fastifyPlugin from 'fastify-plugin';
import * as yup from 'yup';
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    verifyUser: (_request: FastifyRequest, _reply: FastifyReply) => Promise<void>;
  }
}

const userDecodedSchema = yup.object().shape({
  email: yup.string().required(),
  username: yup.string().required(),
  iat: yup.number().required(),
  exp: yup.number().required(),
});

const verifyUser: FastifyPluginAsync = async (fastify, _options) => {
  fastify.decorate('verifyUser', async function (request: FastifyRequest, _reply: FastifyReply) {
    try {
      await request.jwtVerify();
      await userDecodedSchema.validate(request.user);
    } catch (err) {
      throw new Error('Could not verify user');
    }
  });
};

export default fastifyPlugin(verifyUser);
