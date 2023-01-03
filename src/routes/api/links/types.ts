export interface IGetShortUrlQuerystring {
  linkId: string;
}

export interface ICreateShortUrlBody {
  fullUrl: string;
}

export interface IDeleteShortUrlParams {
  id: string;
}
