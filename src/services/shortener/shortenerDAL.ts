import { postgresConnection } from '../../connections';
import { Url } from '../../models';
import { generateId } from '../../utils';
import type { NewUrlEntity } from '../../models';
import type { Repository } from 'typeorm';

class ShortenerDAL {
  urlsRepository: Repository<Url>;

  constructor(urlsRepository: Repository<Url>) {
    this.urlsRepository = urlsRepository;
  }

  public async getUrlById(id: string): Promise<Url | null> {
    const urlObject = await this.urlsRepository.findOneBy({ id });

    return urlObject;
  }

  public async getUrlByLinkId(linkId: string): Promise<Url | null> {
    const urlObject = await this.urlsRepository.findOneBy({ linkId });

    return urlObject;
  }

  public async getAllUrlsCreatedByUser(userId: string): Promise<Url[]> {
    const urlsByUser = await this.urlsRepository.findBy({ createdBy: userId });

    return urlsByUser;
  }

  public async createNewShortUrl(fullUrl: string, userId = 'Anonymous'): Promise<Url> {
    let linkAlreadyExist = true;
    let newLinkId = generateId(8);
    do {
      const urlObject = this.urlsRepository.findOneBy({ linkId: newLinkId });
      if (!urlObject) {
        linkAlreadyExist = false;
      } else {
        newLinkId = generateId(8);
      }
    } while (linkAlreadyExist);

    const newUrlObject: NewUrlEntity = {
      fullUrl,
      linkId: newLinkId,
      views: 0,
      createdBy: userId,
    };

    const createdUrl = await this.urlsRepository.save(newUrlObject);

    return createdUrl;
  }
}

const urlsRepository = postgresConnection.getRepository(Url);

export default new ShortenerDAL(urlsRepository);
