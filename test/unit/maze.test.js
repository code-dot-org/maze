import Maze from '../../src/maze';
import DirtDrawer from '../../src/dirtDrawer';

describe("Maze", function () {
  var dirtMap = [
    [{
      "tileType": 2
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
    document.body.innerHTML = '<div id="container" />';
    maze = new Maze()
    maze.init({
      skinId: 'farmer',
      skin: {
        dirt: 'dirt.png'
      },
      level: {
        serializedMaze: dirtMap
      }
    });

    maze.render("container");
  });

  describe("scheduleDirtChange", function () {
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
