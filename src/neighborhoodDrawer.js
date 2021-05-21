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
    if (row >= this.map_.ROWS || row < 0) return "none";
    if (col >= this.map_.COLS || col < 0) return "none";
    return this.map_.getCell(row, col).getColor() || "none";
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
   * Draw the given tile at row, col
   */
  updateItemImage(r, co, running) {
    let pie = quarterCircle(SQUARE_SIZE);
    let cutOut = cutout(SQUARE_SIZE);
    
    for (let row = -1; row < this.map_.ROWS; row++) {
      for (let col = -1; col < this.map_.COLS; col++) {

        let cells = [
          this.cellColor(row, col),
          this.cellColor(row+1, col),
          this.cellColor(row, col+1),
          this.cellColor(row+1,col+1)];
  
        // Create grid block group
        let grid = makeGrid(row, col, this.svg_);

        // Add a quarter circle to the top left corner of the block if there is 
        // a color value there
        if (cells[0] !== "none") {
          svgElement("path", {d: pie, transform: "rotate(180)", fill: cells[0]}, grid);
        }

        // Add the cutout shape if the top left corner has a color and one other
        // corner shares that color, filling in the top left quadrant of the block
        // completely
        if (cells[0] !== "none" && 
          (cells[0] == cells[1] || cells[0] == cells[2])) {
            svgElement("path", {d: cutOut, transform: "rotate(180)", fill: cells[0]}, grid);

        // Otherwise, if the two adjacent corners have the same color, add the 
        // cutout shape with that color
        } else if (cells[0] == "none" && cells[1] !== "none" && cells[1] == cells[2]) {
          svgElement("path", {d: cutOut, transform: "rotate(180)", fill: cells[1]}, grid);

        // Fill in center corner only if an adjacent cell has the same color, or if 
        // kitty-corner cell is same color and either adjacent is empty
        // Note: this additional logic handles the "clover case", where we want each
        // cell to "pop" out with its own color if diagonals are matching
        } else if (cells[0] !== "none" && (cells[1] == cells[0] || cells[2] == cells[0] || 
          (cells[3] == cells[0] && (cells[1] == "none" || cells[2] == "none")))) {
          svgElement("path", {d: cutOut, transform: "rotate(180)", fill: cells[0]}, grid);
        }

        // The rest of these statements follow the same pattern for each corner
        // of the block
        if (cells[1] && cells[1] !== "none") {
          svgElement("path", {d: pie, transform: "rotate(90)", fill: cells[1]}, grid);
        }

        if (cells[1] !== "none" && 
          (cells[1] == cells[3] || cells[1] == cells[0])) {
          svgElement("path", {d: cutOut, transform: "rotate(90)", fill: cells[1]}, grid);
        } else if (cells[1] == "none" & cells[0] !== "none" && cells[0] == cells[3]) {
          svgElement("path", {d: cutOut, transform: "rotate(90)", fill: cells[0]}, grid);
        } else if (cells[1] !== "none" && (cells[0] == cells[1] || cells[3] == cells[1] ||
          (cells[2] == cells[1] && (cells[0] == "none" || cells[3] == "none")))) {
          svgElement("path", {d: cutOut, transform: "rotate(90)", fill: cells[1]}, grid);
        }

        if (cells[2] && cells[2] !== "none") {  
          svgElement("path", {d: pie, fill: cells[2], transform: "rotate(-90)"}, grid);
        }
        
        if (cells[2] !== "none" && 
          (cells[2] == cells[3] || cells[2] == cells[0])) {
            svgElement("path", {d: cutOut, transform: "rotate(-90)", fill: cells[2]}, grid);
        } else if (cells[2] == "none" && cells[0] !== "none" && cells[0] == cells[3]) {
          svgElement("path", {d: cutOut, transform: "rotate(-90)", fill: cells[0]}, grid);
        } else if (cells[2] !== "none" && (cells[0] == cells[2] || cells[3] == cells[2] ||
          (cells[2] == cells[1] && (cells[0] == "none" || cells[3] == "none")))) {
          svgElement("path", {d: cutOut, transform: "rotate(-90)", fill: cells[2]}, grid);
        }

        if (cells[3] && cells[3] !== "none") {
          svgElement("path", {d: pie, fill: cells[3]}, grid);
        }

        if (cells[3] !== "none" && 
          (cells[3] == cells[1] || cells[3] == cells[2])) {
          svgElement("path", {d: cutOut, fill: cells[3]}, grid);
        } else if (cells[3] == "none" && cells[1] !== "none" && cells[1] == cells[2]) {
          svgElement("path", {d: cutOut, fill: cells[1]}, grid);
        } else if (cells[3] !== "none" && (cells[1] == cells[3] || cells[2] == cells[3] ||
          (cells[3] == cells[0] && (cells[1] == "none" || cells[2] == "none")))) {
          svgElement("path", {d: cutOut,  fill: cells[3]}, grid);
        }
      }
    }
  }
};
