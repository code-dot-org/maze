import Bee from './Bee';
import Cell from './Cell';
import Collector from './Collector';
import {DEFAULT_PEGMAN_ID} from './constants'
import Drawer from './Drawer';
import Farmer from './Farmer';
import Harvester from './Harvester';
import Neighborhood from './Neighborhood';
import Planter from './Planter';
import Scrat from './Scrat';
import Subtype, {SubtypeConstructor} from './Subtype';
import WordSearch from './WordSearch';

/**
 * Return a random value from an array
 */
export function randomValue<T = string | number>(values: T[]): T {
  const key = Math.floor(Math.random() * values.length);
  return values[key];
}

/**
 * Generates an array of integers from start to end inclusive
 */
export function range(start: number, end: number): number[] {
  const ints = [];
  for (let i = start; i <= end; i++) {
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
 * @returns RFC4122-compliant UUID
 */
export function createUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

/**
 * Is skin either farmer or farmer_night
 */
export function isFarmerSkin(skinId: string): boolean {
  return (/farmer(_night)?/).test(skinId);
}

/**
 * Is skin either bee or bee_night
 */
export function isBeeSkin(skinId: string): boolean {
  return (/bee(_night)?/).test(skinId);
}

/**
 * Is skin either collector or collector_night
 */
export function isCollectorSkin(skinId: string): boolean {
  return (/collector(_night)?/).test(skinId);
}

/**
 * Is skin scrat
 */
export function isScratSkin(skinId: string): boolean {
  return (/scrat/).test(skinId);
}

export function isPlanterSkin(skinId: string): boolean {
  return (/planter/).test(skinId);
}

export function isHarvesterSkin(skinId: string): boolean {
  return (/harvester/).test(skinId);
}

export function isWordSearchSkin(skinId: string): boolean {
  return skinId === 'letters';
}

export function isNeighborhoodSkin(skinId: string): boolean {
  return skinId === 'neighborhood';
}

export function getSubtypeForSkin<T extends Cell, U extends Drawer<T>>(skinId: string): SubtypeConstructor<T, U> {
  if (isFarmerSkin(skinId)) {
    return Farmer as unknown as SubtypeConstructor<T, U>;
  }
  if (isBeeSkin(skinId)) {
    return Bee as unknown as SubtypeConstructor<T, U>;
  }
  if (isCollectorSkin(skinId)) {
    return Collector as unknown as SubtypeConstructor<T, U>;
  }
  if (isWordSearchSkin(skinId)) {
    return WordSearch as unknown as SubtypeConstructor<T, U>;
  }
  if (isScratSkin(skinId)) {
    return Scrat as unknown as SubtypeConstructor<T, U>;
  }
  if (isHarvesterSkin(skinId)) {
    return Harvester as unknown as SubtypeConstructor<T, U>;
  }
  if (isPlanterSkin(skinId)) {
    return Planter as unknown as SubtypeConstructor<T, U>;
  }
  if (isNeighborhoodSkin(skinId)) {
    return Neighborhood as unknown as SubtypeConstructor<T, U>;
  }

  return Subtype as SubtypeConstructor<T, U>;
}

// Get html id for a pegman-specific element
export function getPegmanElementId(elementPrefix: string, pegmanId?: string): string {
  let pegmanSuffix = '';

  // if pegmanId is not null, undefined, or DEFAULT_PEGMAN_ID, append it to the elementPrefix
  if (pegmanId && pegmanId !== DEFAULT_PEGMAN_ID) {
    pegmanSuffix = `-${pegmanId}`;
  }

  return `${elementPrefix}${pegmanSuffix}`;
}
