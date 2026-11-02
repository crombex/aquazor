export function randomPickInRange(min: number, max: number, round = false) {
  let value = min + (max - min) * Math.random()
  if (!round) {
    return value
  } else {
    return Math.round(value)
  }
}