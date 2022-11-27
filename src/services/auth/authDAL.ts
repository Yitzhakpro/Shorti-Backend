import { postgresConnection } from '../../connections';
import { NewUserEntity, User } from '../../models';
import { hashString } from '../../utils';
import type { Repository } from 'typeorm';

class AuthDAL {
  private usersRepository: Repository<User>;

  constructor(usersRepository: Repository<User>) {
    this.usersRepository = usersRepository;
  }

  public async createUser(email: string, username: string, password: string): Promise<User> {
    try {
      const hashedPassword = await hashString(password);

      const newUser: NewUserEntity = {
        email: email.toLowerCase(),
        username,
        password: hashedPassword,
      };

      const createdUser = await this.usersRepository.save(newUser);

      return createdUser;
    } catch (err) {
      console.error(err);
      throw new Error('Cant create user');
    }
  }

  public async getUserById(id: string): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOneBy({ id });

      return user;
    } catch (err) {
      console.error(err);
      throw new Error('cant get user by id');
    }
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOneBy({ email });

      return user;
    } catch (err) {
      console.error(err);
      throw new Error('cant get user by email');
    }
  }

  public async getUserByUsername(username: string): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOneBy({ username });

      return user;
    } catch (err) {
      console.error(err);
      throw new Error('cant get user by username');
    }
  }
}

const urlsRepository = postgresConnection.getRepository(User);

export default new AuthDAL(urlsRepository);
