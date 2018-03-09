import tiles from './assets/tiles.png';
import avatar from './assets/avatar.png';

export default {
  skinId: 'farmer',
  skin: {
    pegmanHeight: 52,
    pegmanWidth: 49,
    pegmanYOffset: -8,
    tiles,
    avatar
  },
  level: {
    startDirection: 0,
    serializedMaze: [
      [
        { tileType: 0 },
        { tileType: 0 },
        { tileType: 0 },
        { tileType: 0 },
        { tileType: 0 },
        { tileType: 0 },
        { tileType: 0 },
        { tileType: 0 },
      ],
      [
        { tileType: 0 },
        { tileType: 0 },
        { tileType: 0 },
        { tileType: 0 },
        { tileType: 0 },
        { tileType: 0 },
        { tileType: 0 },
        { tileType: 0 },
      ],
      [
        { tileType: 0 },
        { tileType: 1 },
        { tileType: 1, value: 1, range: 1 },
        { tileType: 1 },
        { tileType: 1, value: 2, range: 2 },
        { tileType: 1 },
        { tileType: 0 },
        { tileType: 0 },
      ],
      [
        { tileType: 0 },
        { tileType: 1, value: 4, range: 4 },
        { tileType: 0 },
        { tileType: 1 },
        { tileType: 0 },
        { tileType: 1, value: 3, range: 3 },
        { tileType: 0 },
        { tileType: 0 },
      ],
      [
        { tileType: 0 },
        { tileType: 1 },
        { tileType: 1 },
        { tileType: 2 },
        { tileType: 1 },
        { tileType: 1 },
        { tileType: 0 },
        { tileType: 0 },
      ],
      [
        { tileType: 0 },
        { tileType: 1, value: 3, range: 3 },
        { tileType: 0 },
        { tileType: 1 },
        { tileType: 0 },
        { tileType: 1, value: 1, range: 1 },
        { tileType: 0 },
        { tileType: 0 },
      ],
      [
        { tileType: 0 },
        { tileType: 1 },
        { tileType: 1, value: 2, range: 2 },
        { tileType: 1 },
        { tileType: 1, value: 4, range: 4 },
        { tileType: 1 },
        { tileType: 0 },
        { tileType: 0 },
      ],
      [
        { tileType: 0 },
        { tileType: 0 },
        { tileType: 0 },
        { tileType: 0 },
        { tileType: 0 },
        { tileType: 0 },
        { tileType: 0 },
        { tileType: 0 },
      ],
    ],
  }
}
