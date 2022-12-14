import { UnauthorizedError } from '../../errorHandler';
import { logger } from '../../logger';
import AuthDAL from './authDAL';
import type { GetUserInfoReturn } from '../../models';

export const isLoggedIn = async (email: string): Promise<GetUserInfoReturn | null> => {
  const user = await AuthDAL.getUserByEmail(email);
  if (!user) {
    logger.warn('authService', 'User tried to check if logged in but account does not exist', { email });

    return null;
  }

  logger.info('authService', 'User is logged in', { email });

  return user.getUserInfo();
};

export const login = async (email: string, password: string): Promise<GetUserInfoReturn> => {
  const user = await AuthDAL.getUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError('authService', 'Wrong credentials', { email });
  }

  const isCorrectPassword = await user.comparePassword(password);
  if (!isCorrectPassword) {
    throw new UnauthorizedError('authService', 'Wrong credentials', { email });
  }

  logger.info('authService', 'User logged in successfully', { email });

  return user.getUserInfo();
};

export const register = async (email: string, username: string, password: string): Promise<GetUserInfoReturn> => {
  const createdUser = await AuthDAL.createUser(email, username, password);

  logger.info('authService', 'User registered successfully', { email, username });

  return createdUser.getUserInfo();
};
