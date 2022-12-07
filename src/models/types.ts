// User
export interface GetUserInfoReturn {
  id: string;
  email: string;
  username: string;
}

// Url
export interface GetUrlInfoReturn {
  id: string;
  fullUrl: string;
  linkId: string;
  views: number;
  createdAt: Date;
}
