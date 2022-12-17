import { ForbiddenError, LINK_ERROR_CODES, NotFoundError } from '../../errorHandler';
import { logger } from '../../logger';
import LinksDAL from './linksDAL';
import type { GetUrlInfoReturn } from '../../models';

export const getShortUrl = async (linkId: string): Promise<string | null> => {
  const urlObject = await LinksDAL.getUrlByLinkId(linkId);
  if (!urlObject) {
    logger.warn('linksService', 'Could not find link by link id', { linkId });
    return null;
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

export const deleteShortUrl = async (shortUrlId: string, userId: string): Promise<void> => {
  const urlObject = await LinksDAL.getUrlById(shortUrlId);
  if (!urlObject) {
    throw new NotFoundError(
      'linksService',
      "Can't delete url becuase url doesn't exist",
      LINK_ERROR_CODES.URL_DELETE_NOT_EXIST_ERROR,
      { shortUrlId, userId }
    );
  }

  if (urlObject.userId !== userId) {
    throw new ForbiddenError(
      'linksService',
      "Can't delete url because it doesnt belong to user",
      LINK_ERROR_CODES.URL_DELETE_FORBIDDEN,
      { shortUrlId, userId }
    );
  }

  await LinksDAL.deleteShortUrl(shortUrlId);
};
