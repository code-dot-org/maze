import Bee from '../../src/bee';
import BeeCell from '../../src/beeCell';
import MazeMap from '../../src/mazeMap';

var baseLevel = {
  honeyGoal: 1,
  map: [
    [0]
  ],
  flowerType: 'redWithNectar',
  startDirection: 1,
  initialDirt: [
    [0]
  ]
};

describe("Bee", function () {
  it("fails if no flowerType", function () {
    var maze = {};
    var config = {
      level: baseLevel
    };
    delete config.level.flowerType;
    expect(() => {
      new Bee(maze, config);
    }).toThrowError(/bad flowerType for Bee/);
  });


  it("fails if invalid flowerType", function () {
    var maze = {};
    var config = {
      level: Object.assign(baseLevel, {
        flowerType: 'invalid'
      })
    };
    expect(() => {
      new Bee(maze, config);
    }).toThrowError(/bad flowerType for Bee/);
  });

  describe("isRedFlower", function () {
    /**
     * Shim a 1x1 maze with the given values and validate that we get the
     * expected result when calling isRedFlower
     */
    function validate(flowerType, mapValue, initialDirtValue, expected, msg) {
      var map = [[mapValue]];

      var config = {
        level: Object.assign(baseLevel, {
          flowerType: flowerType,
          map: map,
          initialDirt: [[initialDirtValue]]
        })
      };
      var maze = {
        map: MazeMap.parseFromOldValues(config.level.map, config.level.initialDirt, BeeCell)
      };
      var bee = new Bee(maze, config);
      expect({msg, result: bee.isRedFlower(0, 0)}).toEqual({msg, result: expected});
    }

    it("red default", function () {
      validate('redWithNectar', 1, 1, true, 'default flower');
      validate('redWithNectar', 1, -1, false, 'default hive');
      validate('redWithNectar', 'P', 1, false, 'overriden purple');
      validate('redWithNectar', 'R', 1, true, 'overriden red');
      validate('redWithNectar', 'FC', 1, true, 'overriden cloud');
    });

    it("purple default", function () {
      validate('purpleNectarHidden', 1, 1, false, 'default flower');
      validate('purpleNectarHidden', 1, -1, false, 'default hive');
      validate('purpleNectarHidden', 'P', 1, false, 'overriden purple');
      validate('purpleNectarHidden', 'R', 1, true, 'overriden red');
      validate('purpleNectarHidden', 'FC', 1, false, 'overriden cloud');
    });
  });
});
