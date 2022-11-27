export const generateId = (length: number): string => {
  const numbers = '0123456789';
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseLetters = uppercaseLetters.toLowerCase();
  const allOptions = uppercaseLetters + lowercaseLetters + numbers;

  let result = '';
  for (let i = 0; i < length; i++) {
    const randomChar = allOptions.charAt(Math.floor(Math.random() * allOptions.length));
    result += randomChar;
  }

  return result;
};
