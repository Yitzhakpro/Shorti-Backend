import { postgresConnection } from '../../connections';
import { NewUserEntity, User } from '../../models';
import { hashString } from '../../utils';
import type { GetUserInfoReturn } from '../../models';
import type { Repository } from 'typeorm';

class AuthDAL {
  private usersRepository: Repository<User>;

  constructor(usersRepository: Repository<User>) {
    this.usersRepository = usersRepository;
  }

  public async createUser(email: string, username: string, password: string): Promise<GetUserInfoReturn> {
    try {
      const hashedPassword = await hashString(password);

      const newUser: NewUserEntity = {
        email: email.toLowerCase(),
        username,
        password: hashedPassword,
      };

      const createdUser = await this.usersRepository.save(newUser);

      return createdUser.userInfo;
    } catch (err) {
      console.error(err);
      throw new Error('Cant create user');
    }
  }

  public async getUserById(id: string): Promise<GetUserInfoReturn | null> {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        return null;
      }

      return user.userInfo;
    } catch (err) {
      console.error(err);
      throw new Error('cant get user by id');
    }
  }

  public async getUserByEmail(email: string): Promise<GetUserInfoReturn | null> {
    try {
      const user = await this.usersRepository.findOneBy({ email });
      if (!user) {
        return null;
      }

      return user.userInfo;
    } catch (err) {
      console.error(err);
      throw new Error('cant get user by email');
    }
  }

  public async getUserByUsername(username: string): Promise<GetUserInfoReturn | null> {
    try {
      const user = await this.usersRepository.findOneBy({ username });
      if (!user) {
        return null;
      }

      return user.userInfo;
    } catch (err) {
      console.error(err);
      throw new Error('cant get user by username');
    }
  }
}

const urlsRepository = postgresConnection.getRepository(User);

export default new AuthDAL(urlsRepository);
