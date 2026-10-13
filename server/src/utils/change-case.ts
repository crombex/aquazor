import * as changeCase from 'change-case';

/**
 * function that switches snake_case -> camelCase
 */
export function mapKeysToCamelCase<T extends object>(obj: object) {
  const newObject = new Object();
  for (const key in obj) {
    if (key.includes('_')) {
      newObject[changeCase.camelCase(key)] = obj[key]; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    } else {
      newObject[key] = obj[key]; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    }
  }
  return newObject as T;
}
