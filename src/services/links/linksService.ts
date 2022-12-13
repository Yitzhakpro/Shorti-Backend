import { NotFoundError } from '../../errorHandler';
import LinksDAL from './linksDAL';
import type { GetUrlInfoReturn } from '../../models';

export const getShortUrl = async (linkId: string): Promise<string> => {
  const urlObject = await LinksDAL.getUrlByLinkId(linkId);
  if (!urlObject) {
    throw new NotFoundError('linksService', 'Could not find link', { linkId });
  }

  await LinksDAL.incrementShortLinkViews(linkId, urlObject.views);

  return urlObject.fullUrl;
};

export const getUrls = async (userId: string): Promise<GetUrlInfoReturn[]> => {
  const urls = await LinksDAL.getUrlsByUser(userId);
  const urlsInfo = urls.map((url) => url.getUrlInfo());

  return urlsInfo;
};

export const createShortUrl = async (fullUrl: string, userId: string): Promise<GetUrlInfoReturn> => {
  const urlObject = await LinksDAL.createNewShortUrl(fullUrl, userId);

  return urlObject;
};
