import { BadRequestError, ForbiddenError, LINK_ERROR_CODES, NotFoundError } from '../../errorHandler';
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

export const createShortUrl = async (fullUrl: string, userId: string, linkName?: string): Promise<GetUrlInfoReturn> => {
  if (linkName) {
    const doesLinkExist = await LinksDAL.doesShortUrlExist(linkName);
    if (doesLinkExist) {
      throw new BadRequestError(
        'linksService',
        "Can't create custom short url because link name is already used",
        LINK_ERROR_CODES.URL_CREATE_ALREADY_EXIST_ERROR,
        { fullUrl, userId, linkName }
      );
    }
  }

  const urlObject = await LinksDAL.createNewShortUrl(fullUrl, userId, linkName);

  logger.info('linksService', 'Successfully created a new short url', { fullUrl, userId });

  return urlObject;
};

export const renameShortUrl = async (id: string, linkName: string, userId: string): Promise<void> => {
  const urlObject = await LinksDAL.getUrlById(id);
  if (!urlObject) {
    throw new NotFoundError(
      'LinksService',
      "Can't rename url because url doesn't exist",
      LINK_ERROR_CODES.URL_RENAME_NOT_EXIST_ERROR,
      { id, linkName }
    );
  }

  if (urlObject.userId !== userId) {
    throw new ForbiddenError(
      'linksService',
      "Can't rename url because it doesn't belong to user",
      LINK_ERROR_CODES.URL_RENAME_FORBIDDEN,
      { id, userId }
    );
  }

  await LinksDAL.renameShortUrl(id, linkName);
};

export const deleteShortUrl = async (id: string, userId: string): Promise<void> => {
  const urlObject = await LinksDAL.getUrlById(id);
  if (!urlObject) {
    throw new NotFoundError(
      'linksService',
      "Can't delete url becuase url doesn't exist",
      LINK_ERROR_CODES.URL_DELETE_NOT_EXIST_ERROR,
      { id, userId }
    );
  }

  if (urlObject.userId !== userId) {
    throw new ForbiddenError(
      'linksService',
      "Can't delete url because it doesn't belong to user",
      LINK_ERROR_CODES.URL_DELETE_FORBIDDEN,
      { id, userId }
    );
  }

  await LinksDAL.deleteShortUrl(id);
};
