import WordSearch from '../../src/wordsearch';

function setGlobals() {
  document.body.innerHTML = '<svg id="svgMaze"></svg>';
}

describe("wordsearch: letterValue", function () {
  expect(WordSearch.START_CHAR).toBeDefined();

  it("letterValue", function () {
    expect(WordSearch.letterValue('A', true)).toEqual('A');
    expect(WordSearch.letterValue('B', true)).toEqual('B');
    expect(WordSearch.letterValue('Z', true)).toEqual('Z');

    expect(WordSearch.letterValue('Ax', true)).toEqual('A');
    expect(WordSearch.letterValue('Bx', true)).toEqual('B');
    expect(WordSearch.letterValue('Zx', true)).toEqual('Z');

    expect(WordSearch.letterValue(2, true)).toEqual(WordSearch.START_CHAR);
  });
});

describe("wordsearch: randomLetter", function () {
  it ("randomLetter without restrictions", function () {
    for (var i = 0; i < 100; i++) {
      expect(WordSearch.randomLetter()).toMatch(/^[A-Z]$/);
    }
  });

  it ("randomLetter with restrictions", function () {
    var allChars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
      "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    var letter = WordSearch.randomLetter(allChars.slice(0, -1));
    // all other chars were restricted
    expect(letter).toEqual('Z');

    for (var i = 0; i < 200; i++) {
      letter = WordSearch.randomLetter(['A']);
      expect(letter).toMatch(/^[B-Z]$/);
    }
  });
});

describe("wordsearch: drawMapTiles", function () {
  it ("simple wordsearch", function () {
    // Create a fake maze.
    var map = [
      ['-', '-', '-', '-', '-', '-', '-', '-'],
      ['-', '-', '-', '-', '-', '-', '-', '-'],
      ['-', '-', '-', '-', '-', '-', '-', '-'],
      ['-', '-', '-', '-', '-', '-', '-', '-'],
      ['-', '-',   2, 'R', 'U', 'N', '-', '-'],
      ['-', '-', '-', '-', '-', '-', '-', '-'],
      ['-', '-', '-', '-', '-', '-', '-', '-'],
      ['-', '-', '-', '-', '-', '-', '-', '-']
    ];

    // create our fake document
    setGlobals();

    var fakeMaze = {
      map: map
    };
    var fakeConfig = {
      level: {
        searchWord: '',
        map: map
      },
      skin: {
        tiles: 'tiles.png'
      }
    };

    var wordSearch = new WordSearch(fakeMaze, fakeConfig);
    wordSearch.createDrawer(document.getElementById('svgMaze'));
    // Not currently doing any validation, so mostly just making sure no
    // exceptions are thrown.
    wordSearch.drawMapTiles(document.getElementById('svgMaze'));
  });

});
