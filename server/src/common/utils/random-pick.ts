export function getRandomValue() {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] / Math.pow(2, 32);
}

export function randomPickInRange(min: number, max: number, round = false) {
  let value = min + (max - min) * getRandomValue()
  if (!round) {
    return value
  } else {
    return Math.round(value)
  }
}