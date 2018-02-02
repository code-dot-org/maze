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

/**
 * Generate a random identifier in a format matching the RFC-4122 specification.
 *
 * Taken from
 * {@link http://byronsalau.com/blog/how-to-create-a-guid-uuid-in-javascript/}
 *
 * @see RFC-4122 standard {@link http://www.ietf.org/rfc/rfc4122.txt}
 *
 * @returns {string} RFC4122-compliant UUID
 */
export function createUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

/**
 * Is skin either farmer or farmer_night
 */
export function isFarmerSkin(skinId) {
  return (/farmer(_night)?/).test(skinId);
}

/**
 * Is skin either bee or bee_night
 */
export function isBeeSkin(skinId) {
  return (/bee(_night)?/).test(skinId);
}

/**
 * Is skin either collector or collector_night
 */
export function isCollectorSkin(skinId) {
  return (/collector(_night)?/).test(skinId);
}

/**
 * Is skin scrat
 */
export function isScratSkin(skinId) {
  return (/scrat/).test(skinId);
}

export function isPlanterSkin(skinId) {
  return (/planter/).test(skinId);
}

export function isHarvesterSkin(skinId) {
  return (/harvester/).test(skinId);
}

export function isWordSearchSkin(skinId) {
  return skinId === 'letters';
}

export function getSubtypeForSkin(skinId) {
  if (isFarmerSkin(skinId)) {
    return require('./farmer');
  }
  if (isBeeSkin(skinId)) {
    return require('./bee');
  }
  if (isCollectorSkin(skinId)) {
    return require('./collector');
  }
  //if (isWordSearchSkin(skinId)) {
  //  return require('./wordsearch');
  //}
  //if (isScratSkin(skinId)) {
  //  return require('./scrat');
  //}
  //if (isHarvesterSkin(skinId)) {
  //  return require('./harvester');
  //}
  //if (isPlanterSkin(skinId)) {
  //  return require('./planter');
  //}

  return require('./subtype');
}
