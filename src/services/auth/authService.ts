import AuthDAL from './authDAL';
import type { GetUserInfoReturn } from '../../models';

export const isLoggedIn = async (email: string): Promise<GetUserInfoReturn> => {
  const user = await AuthDAL.getUserByEmail(email);
  if (!user) {
    throw new Error('user does not exist');
  }

  return user;
};

export const register = async (email: string, username: string, password: string): Promise<GetUserInfoReturn> => {
  const createdUser = await AuthDAL.createUser(email, username, password);

  return createdUser;
};
