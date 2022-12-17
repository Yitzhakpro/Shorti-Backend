import { validate } from 'class-validator';
import { BadRequestError, BaseError, InternalServerError, LINK_ERROR_CODES } from '../../errorHandler';
import { logger } from '../../logger';
import { GetUrlInfoReturn, Url } from '../../models';
import { generateId } from '../../utils';
import { makeUrlValid } from './utils';
import type { DeleteResult } from 'typeorm';

class LinksDAL {
  private urlEntity: typeof Url;

  constructor(urlEntity: typeof Url) {
    this.urlEntity = urlEntity;
  }

  private async doesShortUrlExist(linkId: string): Promise<boolean> {
    try {
      const urlObject = await this.urlEntity.findOneBy({ linkId });

      if (!urlObject) {
        return false;
      }

      logger.info('linksDAL', 'Successfully fetched if url exist in the database', { linkId });

      return true;
    } catch (error) {
      throw new InternalServerError(
        'linksDAL',
        "Can't determine if url exists",
        LINK_ERROR_CODES.FAILED_TO_RETRIVE_LINK_INFO,
        {
          linkId,
          error,
        }
      );
    }
  }

  public async getUrlById(id: string): Promise<Url | null> {
    try {
      const urlObject = await this.urlEntity.findOneBy({ id });

      logger.info('linksDAL', 'Successfully fetched url by id from database', { id });

      return urlObject;
    } catch (error) {
      throw new InternalServerError('linksDAL', "Can't get url by id", LINK_ERROR_CODES.FAILED_TO_RETRIVE_LINK_INFO, {
        id,
        error,
      });
    }
  }

  public async getUrlByLinkId(linkId: string): Promise<Url | null> {
    try {
      const urlObject = await this.urlEntity.findOneBy({ linkId });

      logger.info('linksDAL', 'Successfully fetched url by link id from database', { linkId });

      return urlObject;
    } catch (error) {
      throw new InternalServerError(
        'linksDAL',
        "Can't get url by link id",
        LINK_ERROR_CODES.FAILED_TO_RETRIVE_LINK_INFO,
        { linkId, error }
      );
    }
  }

  public async getUrlsByUser(userId: string): Promise<Url[]> {
    try {
      const urlsByUser = await this.urlEntity.findBy({ userId });

      logger.info('linksDAL', 'Successfully fetched urls of user from the database', { userId });

      return urlsByUser;
    } catch (error) {
      throw new InternalServerError(
        'linksDAL',
        "Can't get url by user id",
        LINK_ERROR_CODES.FAILED_TO_RETRIVE_LINK_INFO,
        { userId, error }
      );
    }
  }

  public async createNewShortUrl(fullUrl: string, userId: string): Promise<GetUrlInfoReturn> {
    try {
      let linkAlreadyExist = true;
      let newLinkId = generateId(8);
      while (linkAlreadyExist) {
        const shortUrlExist = await this.doesShortUrlExist(newLinkId);
        if (!shortUrlExist) {
          linkAlreadyExist = false;
        } else {
          newLinkId = generateId(8);
        }
      }

      const newUrl = new this.urlEntity();
      newUrl.fullUrl = makeUrlValid(fullUrl);
      newUrl.linkId = newLinkId;
      newUrl.views = 0;
      newUrl.userId = userId;

      const validationErrors = await validate(newUrl);
      if (validationErrors.length > 0) {
        // TODO: pass better errors to client
        throw new BadRequestError('linksDAL', 'Bad new url parameters', LINK_ERROR_CODES.URL_CREATE_VALIDATION_ERROR, {
          validationErrors,
        });
      }

      const createdUrl = await newUrl.save();

      logger.info('linksDAL', 'Successfully created new short url in the database', { fullUrl, userId });

      return createdUrl.getUrlInfo();
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }

      throw new InternalServerError('linksDAL', "Can't create a new short url", LINK_ERROR_CODES.URL_CREATE_ERROR, {
        fullUrl,
        userId,
        error,
      });
    }
  }

  public async deleteShortUrl(id: string): Promise<DeleteResult> {
    try {
      const deleteResult = await this.urlEntity.delete({ id });

      return deleteResult;
    } catch (error) {
      throw new InternalServerError('linksDAL', 'Failed to delete short url by id', LINK_ERROR_CODES.URL_DELETE_ERROR, {
        id,
        error,
      });
    }
  }

  public async incrementShortLinkViews(linkId: string, currentViews: number): Promise<void> {
    try {
      await this.urlEntity.update({ linkId }, { views: currentViews + 1 });
    } catch (error) {
      logger.error('linksDAL', 'Failed to increment views of short url in the database', {
        linkId,
        currentViews,
        error,
      });
    }
  }
}

export default new LinksDAL(Url);
