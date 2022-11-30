import bcrypt from 'bcrypt';

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

export const hashString = async (text: string, rounds = 10): Promise<string> => {
  try {
    const hashedString = bcrypt.hash(text, rounds);

    return hashedString;
  } catch (err) {
    console.error(err);
    throw new Error('cant hash password');
  }
};
