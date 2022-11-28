import { User } from '../../models';
import type { GetUserInfoReturn } from '../../models';

class AuthDAL {
  private userEntity: typeof User;

  constructor(userEntity: typeof User) {
    this.userEntity = userEntity;
  }

  public async createUser(email: string, username: string, password: string): Promise<GetUserInfoReturn> {
    try {
      const newUser = new this.userEntity();
      newUser.email = email.toLowerCase();
      newUser.username = username;
      newUser.password = password;

      const createdUser = await newUser.save();

      return createdUser.getUserInfo();
    } catch (err) {
      console.error(err);
      throw new Error('Cant create user');
    }
  }

  public async getUserById(id: string): Promise<GetUserInfoReturn | null> {
    try {
      const user = await this.userEntity.findOneBy({ id });
      if (!user) {
        return null;
      }

      return user.getUserInfo();
    } catch (err) {
      console.error(err);
      throw new Error('cant get user by id');
    }
  }

  public async getUserByEmail(email: string): Promise<GetUserInfoReturn | null> {
    try {
      const user = await this.userEntity.findOneBy({ email });
      if (!user) {
        return null;
      }

      return user.getUserInfo();
    } catch (err) {
      console.error(err);
      throw new Error('cant get user by email');
    }
  }

  public async getUserByUsername(username: string): Promise<GetUserInfoReturn | null> {
    try {
      const user = await this.userEntity.findOneBy({ username });
      if (!user) {
        return null;
      }

      return user.getUserInfo();
    } catch (err) {
      console.error(err);
      throw new Error('cant get user by username');
    }
  }
}

export default new AuthDAL(User);
