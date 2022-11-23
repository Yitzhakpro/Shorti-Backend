import { postgresConnection } from '../../connections';
import { Url } from '../../models';
import { generateId } from '../../utils';
import type { NewUrlEntity } from '../../models';
import type { Repository } from 'typeorm';

class ShortenerDAL {
  private urlsRepository: Repository<Url>;

  constructor(urlsRepository: Repository<Url>) {
    this.urlsRepository = urlsRepository;
  }

  private async doesShortUrlExist(linkId: string): Promise<boolean> {
    try {
      const urlObject = await this.urlsRepository.findOneBy({ linkId });

      if (!urlObject) {
        return false;
      }

      return true;
    } catch (err) {
      console.error(err);
      throw new Error('Cant fetch url info');
    }
  }

  public async getUrlById(id: string): Promise<Url | null> {
    try {
      const urlObject = await this.urlsRepository.findOneBy({ id });

      return urlObject;
    } catch (err) {
      console.error(err);
      throw new Error('cant get url by id');
    }
  }

  public async getUrlByLinkId(linkId: string): Promise<Url | null> {
    try {
      const urlObject = await this.urlsRepository.findOneBy({ linkId });

      return urlObject;
    } catch (err) {
      console.error(err);
      throw new Error('cant get url by link id');
    }
  }

  public async getAllUrlsCreatedByUser(userId: string): Promise<Url[]> {
    try {
      const urlsByUser = await this.urlsRepository.findBy({ createdBy: userId });

      return urlsByUser;
    } catch (err) {
      console.error(err);
      throw new Error('cant get all urls by user');
    }
  }

  public async createNewShortUrl(fullUrl: string, userId = 'Anonymous'): Promise<Url> {
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

      const newUrlObject: NewUrlEntity = {
        fullUrl,
        linkId: newLinkId,
        views: 0,
        createdBy: userId,
      };

      const createdUrl = await this.urlsRepository.save(newUrlObject);

      return createdUrl;
    } catch (err) {
      console.error(err);
      throw new Error('Cant create url');
    }
  }

  public async incrementShortLinkViews(linkId: string): Promise<void> {
    try {
      await this.urlsRepository.increment({ linkId }, 'linkId', 1);
    } catch (err) {
      console.error('failed to increment short link views');
    }
  }
}

const urlsRepository = postgresConnection.getRepository(Url);

export default new ShortenerDAL(urlsRepository);
