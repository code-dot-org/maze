import DirtDrawer from '../../src/dirtDrawer';
import MazeController from '../../src/mazeController';

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

  describe("scheduleDirtChange", function () {
    let mazeController;

    beforeEach(function () {
      document.body.innerHTML = '<div id="svgMaze"><div class="pegman-location"></div></div>';
      mazeController = new MazeController({
        serializedMaze: dirtMap
      }, {
      }, {
        skinId: 'farmer',
        level: {},
        skin: {
          dirt: 'dirt.png'
        }
      });
      mazeController.subtype.createDrawer(document.getElementById('svgMaze'));
      mazeController.setPegmanX(0);
      mazeController.setPegmanY(0);
    });

    it("can cycle through all types", function () {
      var dirtId = DirtDrawer.cellId('', mazeController.getPegmanX(), mazeController.getPegmanY());
      var image;

      // image starts out nonexistant
      expect(document.getElementById(dirtId)).toBeNull();

      mazeController.scheduleFill();
      image = document.getElementById(dirtId);
      // image now exists and is dirt
      expect(image).not.toBeNull()
      expect(image.getAttribute('x')).toEqual("-550")

      mazeController.scheduleDig();
      image = document.getElementById(dirtId);
      // tile is flat, image is therefore hidden
      expect(image).not.toBeNull()
      expect(image.getAttribute('visibility')).toEqual('hidden');

      mazeController.scheduleDig();
      image = document.getElementById(dirtId);
      // image is a holde
      expect(image).not.toBeNull()
      expect(image.getAttribute('x')).toEqual("-500")

      mazeController.scheduleFill();
      image = document.getElementById(dirtId);
      // tile is flat, image is therefore hidden
      expect(image).not.toBeNull()
      expect(image.getAttribute('visibility')).toEqual('hidden');
    });
  });
});
