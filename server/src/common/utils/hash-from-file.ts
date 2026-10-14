import { readFile } from 'fs/promises';
import { createHash } from 'crypto';

export const hashFromFile = async (filePath: string, algorithm: string) => {
  const hash = createHash(algorithm);
  const fileData = await readFile(filePath);
  return hash.update(fileData).digest('hex');
};
