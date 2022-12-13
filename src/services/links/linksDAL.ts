import { validate } from 'class-validator';
import { BadRequestError, InternalServerError } from '../../errorHandler';
import { GetUrlInfoReturn, Url } from '../../models';
import { generateId } from '../../utils';
import { makeUrlValid } from './utils';

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

      return true;
    } catch (error) {
      throw new InternalServerError('linksDAL', "Can't determine if url exists", { linkId, error });
    }
  }

  public async getUrlById(id: string): Promise<Url | null> {
    try {
      const urlObject = await this.urlEntity.findOneBy({ id });

      return urlObject;
    } catch (error) {
      throw new InternalServerError('linksDAL', "Can't get url by id", { id, error });
    }
  }

  public async getUrlByLinkId(linkId: string): Promise<Url | null> {
    try {
      const urlObject = await this.urlEntity.findOneBy({ linkId });

      return urlObject;
    } catch (error) {
      throw new InternalServerError('linksDAL', "Can't get url by link id", { linkId, error });
    }
  }

  public async getUrlsByUser(userId: string): Promise<Url[]> {
    try {
      const urlsByUser = await this.urlEntity.findBy({ userId });

      return urlsByUser;
    } catch (error) {
      throw new InternalServerError('linksDAL', "Can't get url by user id", { userId, error });
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
        throw new BadRequestError('linksDAL', 'Bad new url parameters', { validationErrors });
      }

      const createdUrl = await newUrl.save();

      return createdUrl.getUrlInfo();
    } catch (error) {
      throw new InternalServerError('linksDAL', "Can't create a new short url", { fullUrl, userId, error });
    }
  }

  public async incrementShortLinkViews(linkId: string, currentViews: number): Promise<void> {
    try {
      await this.urlEntity.update({ linkId }, { views: currentViews + 1 });
    } catch (error) {
      console.error("Can't increment link views");
    }
  }
}

export default new LinksDAL(Url);
