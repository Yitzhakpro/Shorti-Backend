import { validate } from 'class-validator';
import { BadRequestError, InternalServerError } from '../../errorHandler';
import { logger } from '../../logger';
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
        throw new BadRequestError('authDAL', 'Bad regestration parameters', { validationErrors });
      }

      const createdUser = await newUser.save();

      logger.info('authDAL', 'Successfully created user in the database', { email, username });

      return createdUser;
    } catch (error) {
      throw new InternalServerError('authDAL', "Can't create username", { email, username, error });
    }
  }

  public async getUserById(id: string): Promise<User | null> {
    try {
      const user = await this.userEntity.findOneBy({ id });
      if (!user) {
        return null;
      }

      logger.info('authDAL', 'Successfully fetched user by id from database', { id });

      return user;
    } catch (error) {
      throw new InternalServerError('authDAL', "Can't get user by id", { id, error });
    }
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userEntity.findOneBy({ email });
      if (!user) {
        return null;
      }

      logger.info('authDAL', 'Successfully fetched user by email from database', { email });

      return user;
    } catch (error) {
      throw new InternalServerError('authDAL', "Can't get user by email", { email, error });
    }
  }

  public async getUserByUsername(username: string): Promise<User | null> {
    try {
      const user = await this.userEntity.findOneBy({ username });
      if (!user) {
        return null;
      }

      logger.info('authDAL', 'Successfully fetched user by username from database', { username });

      return user;
    } catch (error) {
      throw new InternalServerError('authDAL', "Can't get user by username", { username, error });
    }
  }
}

export default new AuthDAL(User);
