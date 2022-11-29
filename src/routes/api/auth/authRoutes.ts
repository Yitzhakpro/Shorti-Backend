import config from '../../../config';
import { authService } from '../../../services';
import { registerSchema } from './schemas';
import type { RegisterBody } from './types';
import type { FastifyPluginAsync } from 'fastify';

const cookieName = config.get('auth.fastifyJwtOptions.cookie.cookieName');
const tokenOptions = config.get('auth.tokenOptions');
const cookieOptions = config.get('auth.cookieOptions');

const authRoutes: FastifyPluginAsync = async (fastify, _options) => {
  fastify.get('/isLoggedIn', async (request, reply) => {
    try {
      const decodedToken = (await request.jwtVerify()) as { email: string; username: string };
      const user = await authService.isLoggedIn(decodedToken.email);

      return reply.send(user);
    } catch (_err) {
      throw new Error('user is not logged in');
    }
  });

  fastify.post<{ Body: RegisterBody }>('/register', { schema: registerSchema }, async (request, reply) => {
    const { email, username, password } = request.body;

    const createdUser = await authService.register(email, username, password);
    const authToken = fastify.jwt.sign(createdUser, tokenOptions);

    return reply.cookie(cookieName, authToken, cookieOptions).send(createdUser);
  });
};

export default authRoutes;
