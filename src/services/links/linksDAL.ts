import { Url } from '../../models';
import { generateId } from '../../utils';

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
    } catch (err) {
      console.error(err);
      throw new Error('Cant fetch url info');
    }
  }

  public async getUrlById(id: string): Promise<Url | null> {
    try {
      const urlObject = await this.urlEntity.findOneBy({ id });

      return urlObject;
    } catch (err) {
      console.error(err);
      throw new Error('cant get url by id');
    }
  }

  public async getUrlByLinkId(linkId: string): Promise<Url | null> {
    try {
      const urlObject = await this.urlEntity.findOneBy({ linkId });

      return urlObject;
    } catch (err) {
      console.error(err);
      throw new Error('cant get url by link id');
    }
  }

  public async getUrlsByUser(userId: string): Promise<Url[]> {
    try {
      const urlsByUser = await this.urlEntity.findBy({ userId });

      return urlsByUser;
    } catch (err) {
      console.error(err);
      throw new Error('cant get all urls by user');
    }
  }

  public async createNewShortUrl(fullUrl: string, userId: string): Promise<Url> {
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
      newUrl.fullUrl = fullUrl;
      newUrl.linkId = newLinkId;
      newUrl.views = 0;
      newUrl.userId = userId;

      const createdUrl = await newUrl.save();

      return createdUrl;
    } catch (err) {
      console.error(err);
      throw new Error('Cant create url');
    }
  }

  public async incrementShortLinkViews(linkId: string, currentViews: number): Promise<void> {
    try {
      await this.urlEntity.update({ linkId }, { views: currentViews + 1 });
    } catch (err) {
      console.error('failed to increment short link views', err);
    }
  }
}

export default new LinksDAL(Url);
