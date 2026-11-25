import * as changeCase from 'change-case';

/**
 * function that switches snake_case -> camelCase
 */
export function mapKeysToCamelCase<T>(obj: Record<string, any>): T {
  const newObject: Record<string, any> = {};
  for (const key in obj) {
    if (key.includes('_')) {
      newObject[changeCase.camelCase(key)] = obj[key]; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    } else {
      newObject[key] = obj[key]; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    }
  }
  return newObject as T;
}
