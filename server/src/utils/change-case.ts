import * as changeCase from 'change-case'

  /**
   * function that switches snake_case -> camelCase
   */
  export function mapKeysToCamelCase<T extends object>(obj: object) {
    const newObject = new Object();
    for (const key in obj) {
      if (key.includes('_')) {
        newObject[changeCase.camelCase(key)] = obj[key];
      } else {
        newObject[key] = obj[key];
      }
    }
    return newObject as T;
  }