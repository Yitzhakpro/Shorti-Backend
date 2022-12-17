export interface IGetShortUrlParams {
  linkId: string;
}

export interface ICreateShortUrlBody {
  fullUrl: string;
}

export interface IDeleteShortUrlParams {
  id: string;
}
