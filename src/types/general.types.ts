export type Enviroment = 'production' | 'development' | 'test';

export interface DecodedAuthToken {
  id: string;
  email: string;
  username: string;
}
