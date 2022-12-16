import bcrypt from 'bcrypt';
import { AUTH_ERROR_CODES, InternalServerError } from '../errorHandler';

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
  } catch (error) {
    throw new InternalServerError('hashPassword', 'Failed to hash string', AUTH_ERROR_CODES.USER_CREATE_ERROR, {
      text,
      rounds,
      error,
    });
  }
};
