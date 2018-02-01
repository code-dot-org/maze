import Maze from '../../src/maze';
import MazeMap from '../../src/mazeMap';
import DirtDrawer from '../../src/dirtDrawer';
import Cell from '../../src/cell';
import Farmer from '../../src/farmer';

describe("Maze", function () {
  var dirtMap = [
    [{
      "tileType": 1
    }, {
      "tileType": 1,
      "value": 1
    }, {
      "tileType": 1,
      "value": -1
    }],
  ];

  let maze;

  beforeEach(() => {
    maze = new Maze();
  });

  describe("scheduleDirtChange", function () {
    beforeEach(function () {
      document.body.innerHTML = '<div id="svgMaze"><div class="pegman-location"></div></div>';
      maze.map = MazeMap.deserialize(dirtMap, Cell);
      maze.subtype = new Farmer(maze, {}, {
        skin: {
          dirt: 'dirt.png'
        },
        level: {},
      });
      maze.subtype.createDrawer(document.getElementById('svgMaze'));
      maze.pegmanX = 0;
      maze.pegmanY = 0;
    });

    it("can cycle through all types", function () {
      var dirtId = DirtDrawer.cellId('', maze.pegmanX, maze.pegmanY);
      var image;

      // image starts out nonexistant
      expect(document.getElementById(dirtId)).toBeNull();

      maze.scheduleFill();
      image = document.getElementById(dirtId);
      // image now exists and is dirt
      expect(image).not.toBeNull()
      expect(image.getAttribute('x')).toEqual("-550")

      maze.scheduleDig();
      image = document.getElementById(dirtId);
      // tile is flat, image is therefore hidden
      expect(image).not.toBeNull()
      expect(image.getAttribute('visibility')).toEqual('hidden');

      maze.scheduleDig();
      image = document.getElementById(dirtId);
      // image is a holde
      expect(image).not.toBeNull()
      expect(image.getAttribute('x')).toEqual("-500")

      maze.scheduleFill();
      image = document.getElementById(dirtId);
      // tile is flat, image is therefore hidden
      expect(image).not.toBeNull()
      expect(image.getAttribute('visibility')).toEqual('hidden');
    });
  });
});
