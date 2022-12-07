export const makeUrlValid = (url: string): string => {
  let completeUrl = '';

  if (!url.startsWith('http://') || !url.startsWith('https://')) {
    completeUrl += 'https://';
  }

  completeUrl += url;

  return completeUrl;
};
