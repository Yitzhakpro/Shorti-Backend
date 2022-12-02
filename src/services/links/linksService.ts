import LinksDAL from './linksDAL';
import type { Url } from '../../models';

export const getShortUrl = async (linkId: string): Promise<string> => {
  const urlObject = await LinksDAL.getUrlByLinkId(linkId);
  if (!urlObject) {
    throw new Error('url do not exist');
  }

  await LinksDAL.incrementShortLinkViews(linkId, urlObject.views);

  return urlObject.fullUrl;
};

export const createShortUrl = async (fullUrl: string): Promise<Url> => {
  const urlObject = await LinksDAL.createNewShortUrl(fullUrl);

  return urlObject;
};
