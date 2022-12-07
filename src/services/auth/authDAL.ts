import { validate } from 'class-validator';
import { User } from '../../models';

class AuthDAL {
  private userEntity: typeof User;

  constructor(userEntity: typeof User) {
    this.userEntity = userEntity;
  }

  public async createUser(email: string, username: string, password: string): Promise<User> {
    try {
      const newUser = new this.userEntity();
      newUser.email = email.toLowerCase();
      newUser.username = username;
      newUser.password = password;

      const validationErrors = await validate(newUser);
      if (validationErrors.length > 0) {
        throw new Error('validation failed');
      }

      const createdUser = await newUser.save();

      return createdUser;
    } catch (err) {
      console.error(err);
      throw new Error('Cant create user');
    }
  }

  public async getUserById(id: string): Promise<User | null> {
    try {
      const user = await this.userEntity.findOneBy({ id });
      if (!user) {
        return null;
      }

      return user;
    } catch (err) {
      console.error(err);
      throw new Error('cant get user by id');
    }
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userEntity.findOneBy({ email });
      if (!user) {
        return null;
      }

      return user;
    } catch (err) {
      console.error(err);
      throw new Error('cant get user by email');
    }
  }

  public async getUserByUsername(username: string): Promise<User | null> {
    try {
      const user = await this.userEntity.findOneBy({ username });
      if (!user) {
        return null;
      }

      return user;
    } catch (err) {
      console.error(err);
      throw new Error('cant get user by username');
    }
  }
}

export default new AuthDAL(User);
