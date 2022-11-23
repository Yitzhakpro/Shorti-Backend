import ShortenerDAL from './shortenerDAL';
import type { Url } from '../../models';

export const getShortUrl = async (linkId: string): Promise<string> => {
  const urlObject = await ShortenerDAL.getUrlByLinkId(linkId);
  if (!urlObject) {
    throw new Error('url do not exist');
  }

  await ShortenerDAL.incrementShortLinkViews(linkId);

  return urlObject.fullUrl;
};

export const createShortUrl = async (fullUrl: string): Promise<Url> => {
  const urlObject = await ShortenerDAL.createNewShortUrl(fullUrl);

  return urlObject;
};
