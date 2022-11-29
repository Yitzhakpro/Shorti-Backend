import config from '../../../config';
import { authService } from '../../../services';
import { registerSchema } from './schemas';
import type { RegisterBody } from './types';
import type { FastifyPluginAsync } from 'fastify';

const cookieName = config.get('auth.fastifyJwtOptions.cookie.cookieName');
const tokenOptions = config.get('auth.tokenOptions');
const cookieOptions = config.get('auth.cookieOptions');

const authRoutes: FastifyPluginAsync = async (fastify, _options) => {
  fastify.post<{ Body: RegisterBody }>('/register', { schema: registerSchema }, async (request, reply) => {
    const { email, username, password } = request.body;

    const createdUser = await authService.register(email, username, password);
    const authToken = fastify.jwt.sign(createdUser, tokenOptions);

    return reply.cookie(cookieName, authToken, cookieOptions).send(createdUser);
  });
};

export default authRoutes;
