export interface IGetShortUrlQuerystring {
  linkId: string;
}

export interface ICreateShortUrlBody {
  fullUrl: string;
  linkName?: string;
}

export interface IRenameShortUrlBody {
  id: string;
  linkName: string;
}

export interface IDeleteShortUrlParams {
  id: string;
}
