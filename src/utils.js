const DEFAULT_PEGMAN_ID = require('./constants').DEFAULT_PEGMAN_ID;

/**
 * Version of modulo which, unlike javascript's `%` operator,
 * will always return a positive remainder.
 * @param number
 * @param mod
 */
module.exports.mod = function mod(number, modulus) {
  return ((number % modulus) + modulus) % modulus;
}

/**
 * Return a random value from an array
 */
module.exports.randomValue = function randomValue(values) {
  let key = Math.floor(Math.random() * values.length);
  return values[key];
}

/**
 * Rotate the given 2d array
 * @param {Array[]} data
 */
module.exports.rotate2DArray = function rotate2DArray(data) {
  return data[0].map((x, i) => data.map(x => x[data.length - i - 1]));
}

/**
 * Generates an array of integers from start to end inclusive
 */
module.exports.range = function range(start, end) {
  var ints = [];
  for (var i = start; i <= end; i++) {
    ints.push(i);
  }
  return ints;
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
module.exports.createUuid = function createUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

/**
 * Is skin either farmer or farmer_night
 */
module.exports.isFarmerSkin = function isFarmerSkin(skinId) {
  return (/farmer(_night)?/).test(skinId);
}

/**
 * Is skin either bee or bee_night
 */
module.exports.isBeeSkin = function isBeeSkin(skinId) {
  return (/bee(_night)?/).test(skinId);
}

/**
 * Is skin either collector or collector_night
 */
module.exports.isCollectorSkin = function isCollectorSkin(skinId) {
  return (/collector(_night)?/).test(skinId);
}

/**
 * Is skin scrat
 */
module.exports.isScratSkin = function isScratSkin(skinId) {
  return (/scrat/).test(skinId);
}

module.exports.isPlanterSkin = function isPlanterSkin(skinId) {
  return (/planter/).test(skinId);
}

module.exports.isHarvesterSkin = function isHarvesterSkin(skinId) {
  return (/harvester/).test(skinId);
}

module.exports.isWordSearchSkin = function isWordSearchSkin(skinId) {
  return skinId === 'letters';
}

module.exports.getSubtypeForSkin = function getSubtypeForSkin(skinId) {
  if (module.exports.isFarmerSkin(skinId)) {
    return require('./farmer');
  }
  if (module.exports.isBeeSkin(skinId)) {
    return require('./bee');
  }
  if (module.exports.isCollectorSkin(skinId)) {
    return require('./collector');
  }
  if (module.exports.isWordSearchSkin(skinId)) {
    return require('./wordsearch');
  }
  if (module.exports.isScratSkin(skinId)) {
    return require('./scrat');
  }
  if (module.exports.isHarvesterSkin(skinId)) {
    return require('./harvester');
  }
  if (module.exports.isPlanterSkin(skinId)) {
    return require('./planter');
  }

  return require('./subtype');
}

// Get html id for a pegman-specific element
module.exports.getPegmanElementId = function getElementId(elementPrefix, pegmanId) {
  var pegmanSuffix = '';
  if (!module.exports.isDefaultPegman(pegmanId)) {
    pegmanSuffix = `-${pegmanId}`;
  }
  return `${elementPrefix}${pegmanSuffix}`;
}

module.exports.isDefaultPegman  = function isDefaultPegmen(id){
  return id == null || id === DEFAULT_PEGMAN_ID;
}
