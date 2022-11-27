import { User } from './User';
import type { Url } from './Url';

export type NewUrlEntity = Omit<Url, 'id' | 'created_at' | 'updated_at'>;

export type NewUserEntity = Omit<User, 'id' | 'created_at' | 'updated_at'>;
