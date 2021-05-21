const { SQUARE_SIZE, SVG_NS } = require("./drawer");
const Drawer = require('./drawer')

// Helper for creating SVG elements
function svgElement(tag, props, parent) {
  const element = document.createElementNS(SVG_NS, tag);
  Object.keys(props).map(function (key) {
    element.setAttribute(key, props[key])
  });

  if (parent) {
    parent.appendChild(element);
  }

  return element;
}

// Path drawing a quarter circle
//    --+
//  /   |
//  +---+
function quarterCircle(size) {
  let halfSize = size/2;
  let quarterSize = size/4;
  return `m${halfSize} ${halfSize}h-${halfSize}c0-${quarterSize} ${quarterSize}-${halfSize} ${halfSize}-${halfSize}z`;
}

// Path of the the slice of a square remaining once a quarter circle is 
// removed from it
// +----+
// | /
// + 
function cutout(size) {
  let halfSize = size / 2;
  let quarterSize = size / 4;
  return `m0 0v${halfSize}c0-${quarterSize} ${quarterSize}-${halfSize} ${halfSize}-${halfSize}z`
}

function makeGrid(row, col, svg) {
  return svgElement("g", {
    transform: `translate(${col * SQUARE_SIZE + SQUARE_SIZE}, 
      ${row * SQUARE_SIZE + SQUARE_SIZE})`
  }, svg);
}

module.exports = class NeighborhoodDrawer extends Drawer {

  constructor(map, asset, svg, squareSize, neighborhood) {
    super(map, asset, svg);
    this.squareSize = squareSize;
    this.neighborhood = neighborhood
  }

  /**
   * @override
   */
  getAsset(prefix, row, col) {
    const cell = this.neighborhood.getCell(row, col);
    if (cell.getAssetId() != null) {
      return this.neighborhood.getSpriteMap()[cell.getAssetId()];
    }
  }

  resetTiles() {}

  // Quick helper to retrieve the color stored in this cell
  cellColor(row, col) {
    if (row >= this.map_.ROWS || row < 0) return null;
    if (col >= this.map_.COLS || col < 0) return null;
    return this.map_.getCell(row, col).getColor() || null;
  }

  // Helper method for determining color and path based on neighbors
  pathCalculator(subjectCell, adjacent1, adjacent2, kitty, transform, grid) {
    let pie = quarterCircle(SQUARE_SIZE);
    let cutOut = cutout(SQUARE_SIZE);
    let tag = "path";
    // Add a quarter circle to the top left corner of the block if there is 
    // a color value there
    if (subjectCell) {
      svgElement(tag, {d: pie, transform: transform, fill: subjectCell}, grid);
    }
    // Add the cutout if the top left corner has a color and an adjacent cell
    // shares that color, filling in the top left quadrant of the block entirely
    if (subjectCell && (subjectCell == adjacent1 || subjectCell == adjacent2)) {
      svgElement(tag, {d: cutOut, transform: transform, fill: subjectCell}, grid);
    } 
    // Otherwise, if the two adjacent corners have the same color, add the 
    // cutout shape with that color
    else if (adjacent1 && adjacent1 == adjacent2 && 
      ((!kitty || !subjectCell) || subjectCell !== kitty)) {
      svgElement(tag, {d: cutOut, transform: transform, fill: adjacent1}, grid);
    }
    // Fill in center corner only if an adjacent cell has the same color, or if 
    // kitty-corner cell is same color and either adjacent is empty
    // Note: this handles the "clover case", where we want each
    // cell to "pop" out with its own color if diagonals are matching
    else if (subjectCell && (adjacent1 == subjectCell || adjacent2 == subjectCell ||
      (kitty == subjectCell && ((adjacent1 == null || adjacent2 == null) || adjacent1 !== adjacent2)))) {
      svgElement(tag, {d: cutOut, transform: transform, fill: subjectCell}, grid);
    }
  }

  /**
   * @override
   * Draw the given tile at row, col
   */
   drawTile(svg, tileSheetLocation, row, col, tileId, tileSheetHref) {
    // we have one background tile for neighborhood (we don't define paths like
    // the other skins). Therefore our 'tile sheet' is just one square.
    const tileSheetWidth = this.squareSize;
    const tileSheetHeight = this.squareSize;

    super.drawTileHelper(
      svg, 
      tileSheetLocation, 
      row, 
      col, 
      tileId, 
      tileSheetHref, 
      tileSheetWidth, 
      tileSheetHeight, 
      this.squareSize
    );
  }

    /**
   * @override
   * This method is used to display the paint, so has to reprocess the entire grid
   * to get the paint glomming correct
   */
  updateItemImage(r, co, running) {
    for (let row = -1; row < this.map_.ROWS; row++) {
      for (let col = -1; col < this.map_.COLS; col++) {

        /**
         * In a grid of four cells: top left, top right, bottom left, bottom right
         * So if we are painting cell 0, adjacent cells are 1 & 2, kittycorner is 3
         * +-------+
         * | 0 | 1 |
         * --------
         * | 2 | 3 |
         * +-------+
         */
        let cells = [
          this.cellColor(row, col),
          this.cellColor(row, col+1),
          this.cellColor(row+1, col),
          this.cellColor(row+1,col+1)];

        // Create grid block group
        let grid = makeGrid(row, col, this.svg_);

        // Calculate all the svg paths based on neighboring cell colors
        this.pathCalculator(cells[0], cells[1], cells[2], cells[3], "rotate(180)", grid);
        this.pathCalculator(cells[1], cells[0], cells[3], cells[2], "rotate(-90)", grid);
        this.pathCalculator(cells[2], cells[0], cells[3], cells[1], "rotate(90)", grid);
        this.pathCalculator(cells[3], cells[1], cells[2], cells[0], "rotate(0)", grid);
      }
    }
  }
};
