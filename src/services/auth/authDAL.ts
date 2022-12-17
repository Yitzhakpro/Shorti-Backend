import { validate } from 'class-validator';
import { AUTH_ERROR_CODES, BadRequestError, BaseError, InternalServerError } from '../../errorHandler';
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
        throw new BadRequestError(
          'authDAL',
          'Bad regestration parameters',
          AUTH_ERROR_CODES.USER_CREATE_VALIDATION_ERROR,
          { validationErrors }
        );
      }

      const createdUser = await newUser.save();

      logger.info('authDAL', 'Successfully created user in the database', { email, username });

      return createdUser;
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }

      throw new InternalServerError('authDAL', "Can't create username", AUTH_ERROR_CODES.USER_CREATE_ERROR, {
        email,
        username,
        error,
      });
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
      throw new InternalServerError('authDAL', "Can't get user by id", AUTH_ERROR_CODES.FAILED_TO_RETRIVE_USER_INFO, {
        id,
        error,
      });
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
      throw new InternalServerError(
        'authDAL',
        "Can't get user by email",
        AUTH_ERROR_CODES.FAILED_TO_RETRIVE_USER_INFO,
        { email, error }
      );
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
      throw new InternalServerError(
        'authDAL',
        "Can't get user by username",
        AUTH_ERROR_CODES.FAILED_TO_RETRIVE_USER_INFO,
        { username, error }
      );
    }
  }
}

export default new AuthDAL(User);
