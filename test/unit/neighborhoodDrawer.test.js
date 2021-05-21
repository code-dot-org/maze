import {quarterCircle, cutout, makeGrid, svgElement} from '../../src/neighborhoodDrawer';

describe("Painting", function () {
  SQUARE_SIZE = 100;
  svg = document.getElementById('svgMaze');
  pieSlice = quarterCircle(SQUARE_SIZE);
  pieCutout = cutout(SQUARE_SIZE);

  it("can give us a quarter circle and a cutout", function () {
    expect(pieSlice).toEqual(`m50 50h-50c0-25 25-50 50-50z`);
    expect(cutout).toEqual(`m0 0v50c0-25 25-50 50-50z`);
  })

  it("can make an svg element", function () {
    newGrid = makeGrid(0, 0, svg);
    element = svgElement(
        "path",
        {d: pieCutout, transform: "rotate(90)", fill: "blue"},
        newGrid
        );
    expect(element).toEqual();
  })
});