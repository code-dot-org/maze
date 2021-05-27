const { SQUARE_SIZE, SVG_NS } = require("./drawer");
const Drawer = require('./drawer')
const tiles = require('./tiles');

const ROTATE180 = "rotate(180)";
const ROTATENEG90 = "rotate(-90)";
const ROTATE90 = "rotate(90)";
const ROTATE0 = "rotate(0)";
const CUT = "cut";
const PIE = "pie";

// Helper for creating SVG elements
function svgElement(tag, props, parent, id) {
  var node = document.getElementById(id);
    if (!node) {
      node = document.createElementNS(SVG_NS, tag);
      node.setAttribute("id", id);
    }
  Object.keys(props).map(function (key) {
    node.setAttribute(key, props[key])
  });
  if (parent) {
    parent.appendChild(node);
  }
  return node;
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
  let id = "g" + row + "." + col;
  return svgElement("g", {
    transform: `translate(${col * SQUARE_SIZE + SQUARE_SIZE}, 
      ${row * SQUARE_SIZE + SQUARE_SIZE})`
  }, svg, id);
}

module.exports = class NeighborhoodDrawer extends Drawer {

  constructor(map, asset, svg, squareSize, neighborhood) {
    super(map, asset, svg);
    this.squareSize = squareSize;
    this.neighborhood = neighborhood
  }

  resetTile(row, col) {
    let neighbors = [
      "g" + row + "." + col,
      "g" + (row - 1) + "." + (col - 1),
      "g" + row + "." + (col - 1),
      "g" + (row - 1) + "." + col
    ];
    for (const neighbor of neighbors) {
      var node = document.getElementById(neighbor);
      if (node) {
        node.querySelectorAll('*').forEach(n => n.remove());
      }
    }
  }

  /**
   * @override
  */
  getAsset(prefix, row, col) {
    const cell = this.neighborhood.getCell(row, col);
    // If the tile has an asset id, return the sprite asset. Ignore the asset id
    // if this is a start tile, as start tiles will handle placing the pegman separately.
    if (cell.getAssetId() != null && cell.getTile() !== tiles.SquareType.START) {
      return this.neighborhood.getSpriteMap()[cell.getAssetId()];
    }
  }

  resetTiles() {}

  // Quick helper to retrieve the color stored in this cell
  // Ensures 'padding cells' (row/col < 0) have no color
  cellColor(row, col) {
    if (row >= this.map_.ROWS || row < 0) return null;
    if (col >= this.map_.COLS || col < 0) return null;
    return this.map_.getCell(row, col).getColor() || null;
  }

  // Helper method for determining color and path based on neighbors
  pathCalculator(subjectCell, adjacent1, adjacent2, diagonal, transform, grid, id) {
    let pie = quarterCircle(SQUARE_SIZE);
    let cutOut = cutout(SQUARE_SIZE);
    let tag = "path";

    // Add a quarter circle to the top left corner of the block if there is 
    // a color value there
    if (subjectCell) {
      svgElement(tag, {d: pie, stroke: subjectCell, transform: transform, fill: subjectCell}, grid, id + PIE);
    }
    // Add the cutout if the top left corner has a color and an adjacent cell
    // shares that color, filling in the top left quadrant of the block entirely
    if (subjectCell && (subjectCell === adjacent1 || subjectCell === adjacent2)) {
      svgElement(tag, {d: cutOut, stroke: subjectCell, transform: transform, fill: subjectCell}, grid, id + CUT);
    } 
    // Otherwise, if the two adjacent corners have the same color, add the 
    // cutout shape with that color
    else if (adjacent1 && adjacent1 === adjacent2 && 
      ((!diagonal || !subjectCell) || subjectCell !== diagonal)) {
      svgElement(tag, {d: cutOut, stroke: adjacent1, transform: transform, fill: adjacent1}, grid, id + CUT);
    }
    // Fill in center corner only if an adjacent cell has the same color, or if 
    // the diagonal cell is same color and either adjacent is empty
    // Note: this handles the "clover case", where we want each
    // cell to "pop" out with its own color if diagonals are matching
    else if (subjectCell && (adjacent1 === subjectCell || adjacent2 === subjectCell ||
      (diagonal === subjectCell && ((!adjacent1 || !adjacent2) || adjacent1 !== adjacent2)))) {
      svgElement(tag, {d: cutOut, stroke: subjectCell, transform: transform, fill: subjectCell}, grid, id + CUT);
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

    // Because this processes a grid of cells at a time, we start at -1 to allow for
    // a 'padding' row and column with no color.
    for (let row = -1; row < this.map_.ROWS; row++) {
      for (let col = -1; col < this.map_.COLS; col++) {

        /**
         * In a grid of four cells: top left, top right, bottom left, bottom right
         * So if we are painting cell 0, adjacent cells are 1 & 2, diagonal is 3
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
          this.cellColor(row+1,col+1)
        ];

        if (cells[0] || cells[1] || cells[2] || cells[3]) {
          // Create grid block group
          let grid = makeGrid(row, col, this.svg_);
          let id0 = row + "." + col + "." + ROTATE180;
          let id1 = row + "." + col + "." + ROTATENEG90;
          let id2 = row + "." + col + "." + ROTATE90;
          let id3 = row + "." + col + "." + ROTATE0;

          // Calculate all the svg paths based on neighboring cell colors
          this.pathCalculator(cells[0], cells[1], cells[2], cells[3], ROTATE180, grid, id0);
          this.pathCalculator(cells[1], cells[0], cells[3], cells[2], ROTATENEG90, grid, id1);
          this.pathCalculator(cells[2], cells[0], cells[3], cells[1], ROTATE90, grid, id2);
          this.pathCalculator(cells[3], cells[1], cells[2], cells[0], ROTATE0, grid, id3);
        }
      }
    }
  }
};
