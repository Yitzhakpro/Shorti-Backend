import AuthDAL from './authDAL';
import type { GetUserInfoReturn } from '../../models';

export const register = async (email: string, username: string, password: string): Promise<GetUserInfoReturn> => {
  const createdUser = await AuthDAL.createUser(email, username, password);

  return createdUser;
};
