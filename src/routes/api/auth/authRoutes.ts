import { authService } from '../../../services';
import { registerSchema } from './schemas';
import type { RegisterBody } from './types';
import type { FastifyPluginAsync } from 'fastify';

const authRoutes: FastifyPluginAsync = async (fastify, _options) => {
  fastify.post<{ Body: RegisterBody }>('/register', { schema: registerSchema }, async (request, reply) => {
    const { email, username, password } = request.body;

    const createdUser = await authService.register(email, username, password);

    reply.send(createdUser);
  });
};

export default authRoutes;
