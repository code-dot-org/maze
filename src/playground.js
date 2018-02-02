import Maze from './maze';
import tiles from '../assets/tiles.png';
import avatar from '../assets/avatar.png';

const container = document.createElement('div');
container.id = 'container';
document.body.appendChild(container);

const maze = window.maze = new Maze()

maze.init({
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
  },
  studioApp: function() {
    return {};
  },
});

window.maze.render('container');
