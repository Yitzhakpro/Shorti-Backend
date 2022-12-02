// Url
export interface NewUrlEntity {
  fullUrl: string;
  linkId: string;
  views: number;
  user: string;
}

// User

export interface NewUserEntity {
  email: string;
  username: string;
  password: string;
}

export interface GetUserInfoReturn {
  email: string;
  username: string;
}
