import ms from 'ms'

export function addStringTime(unixTime: number, deltaTime: ms.StringValue): number {
  return unixTime + ms(deltaTime)
}