import { NotFoundError } from '../../errorHandler';
import { logger } from '../../logger';
import LinksDAL from './linksDAL';
import type { GetUrlInfoReturn } from '../../models';

export const getShortUrl = async (linkId: string): Promise<string> => {
  const urlObject = await LinksDAL.getUrlByLinkId(linkId);
  if (!urlObject) {
    throw new NotFoundError('linksService', 'Could not find link', { linkId });
  }

  await LinksDAL.incrementShortLinkViews(linkId, urlObject.views);

  logger.info('linksService', 'Successfully fetched url', { linkId, fullUrl: urlObject.fullUrl });

  return urlObject.fullUrl;
};

export const getUrls = async (userId: string): Promise<GetUrlInfoReturn[]> => {
  const urls = await LinksDAL.getUrlsByUser(userId);
  const urlsInfo = urls.map((url) => url.getUrlInfo());

  logger.info('linksService', "Successfully fetched all user's urls", { userId });

  return urlsInfo;
};

export const createShortUrl = async (fullUrl: string, userId: string): Promise<GetUrlInfoReturn> => {
  const urlObject = await LinksDAL.createNewShortUrl(fullUrl, userId);

  logger.info('linksService', 'Successfully created a new short url', { fullUrl, userId });

  return urlObject;
};
