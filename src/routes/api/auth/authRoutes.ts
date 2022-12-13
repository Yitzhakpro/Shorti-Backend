import config from '../../../config';
import { authService } from '../../../services';
import { loginSchema, registerSchema } from './schemas';
import type { LoginBody, RegisterBody } from './types';
import type { FastifyPluginAsync } from 'fastify';

const cookieName = config.get('auth.fastifyJwtOptions.cookie.cookieName');
const tokenOptions = config.get('auth.tokenOptions');
const cookieOptions = config.get('auth.cookieOptions');

const authRoutes: FastifyPluginAsync = async (fastify, _options) => {
  fastify.get('/isLoggedIn', async (request, reply) => {
    try {
      const decodedToken = (await request.jwtVerify()) as { id: string; email: string; username: string };
      const user = await authService.isLoggedIn(decodedToken.email);

      return reply.send(user);
    } catch (_err) {
      return reply.send(null);
    }
  });

  fastify.post<{ Body: LoginBody }>('/login', { schema: loginSchema }, async (request, reply) => {
    const { email, password } = request.body;

    const loggedUser = await authService.login(email, password);
    const authToken = fastify.jwt.sign(loggedUser, tokenOptions);

    return reply.cookie(cookieName, authToken, cookieOptions).send(loggedUser);
  });

  fastify.post<{ Body: RegisterBody }>('/register', { schema: registerSchema }, async (request, reply) => {
    const { email, username, password } = request.body;

    const createdUser = await authService.register(email, username, password);
    const authToken = fastify.jwt.sign(createdUser, tokenOptions);

    return reply.cookie(cookieName, authToken, cookieOptions).send(createdUser);
  });

  fastify.post('/logout', async (_request, reply) => {
    return reply.clearCookie(cookieName).send('Ok');
  });
};

export default authRoutes;
