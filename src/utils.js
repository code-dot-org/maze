/**
 * Version of modulo which, unlike javascript's `%` operator,
 * will always return a positive remainder.
 * @param number
 * @param mod
 */
export function mod(number, mod) {
  return ((number % mod) + mod) % mod;
}

/**
 * Return a random value from an array
 */
export function randomValue(values) {
  let key = Math.floor(Math.random() * values.length);
  return values[key];
}
