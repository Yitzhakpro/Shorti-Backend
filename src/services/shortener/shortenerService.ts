import ShortenerDAL from './shortenerDAL';

export const getShortUrl = async (linkId: string) => {
  const urlObject = await ShortenerDAL.getUrlByLinkId(linkId);
  if (!urlObject) {
    throw new Error('url do not exist');
  }

  await ShortenerDAL.incrementShortLinkViews(linkId);

  return urlObject.fullUrl;
};
