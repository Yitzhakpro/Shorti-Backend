import fastifyPlugin from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    verifyUser: (_request: FastifyRequest, _reply: FastifyReply) => Promise<void>;
  }
}

const verifyUser: FastifyPluginAsync = async (fastify, _options) => {
  fastify.decorate('verifyUser', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
};

export default fastifyPlugin(verifyUser);
