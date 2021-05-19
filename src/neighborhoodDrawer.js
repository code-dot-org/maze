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
  let hs = size/2;
  let cp = size/4;
  return `m${hs} ${hs}h-${hs}c0-${cp} ${cp}-${hs} ${hs}-${hs}z`;
}

// Path of the the slice of a square remaining once a quarter circle is 
// removed from it
// +----+
// | /
// + 
function cutout(size) {
  let hs = size / 2;
  let cp = size / 4;
  return `m0 0v${hs}c0-${cp} ${cp}-${hs} ${hs}-${hs}z`
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

  // TODO: There is a way to get the value of a cell reliably but I couldn't
  // get it to work. This is a workaround method to simplify the logic below
  cellColor(row, col) {
    if (row >= this.map_.ROWS) return "none";
    if (col >= this.map_.COLS) return "none";
    return this.map_.currentStaticGrid[row][col].originalValue_ || "none";
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
    let qc = quarterCircle(SQUARE_SIZE);
    let c = cutout(SQUARE_SIZE);
    
    for (let row = 0; row < this.map_.ROWS; row++) {
      for (let col = 0; col < this.map_.COLS; col++) {
        // Top left, top right, bottom left, bottom right
        let cells = [
          this.cellColor(row, col),
          this.cellColor(row+1, col),
          this.cellColor(row, col+1),
          this.cellColor(row+1,col+1)];
  
        // Create grid block group
        let grid = svgElement("g", {
            transform: `translate(${row * SQUARE_SIZE + SQUARE_SIZE/2}, 
              ${col * SQUARE_SIZE + SQUARE_SIZE/2})`
          }, this.svg_);

        // Add a quarter circle to the top left corner of the block if there is 
        // a color value there
        if (cells[0] !== "none") {
          svgElement("path", {d: qc, fill: cells[0], transform:"rotate(180)"}, grid);
        }

        // Add a cutout shape if the top left corner has a color and one other
        // corner shares that color, filling in the top left quadrant of the block
        // completely
        if (cells[0] !== "none" && 
          (cells[0] == cells[1] || cells[0] == cells[2] || cells[0] == cells[3])) {
            svgElement("path", {d: c, transform: "rotate(180)", fill: cells[0]}, grid);

        // Otherwise, if the two adjacent corners have the same color, add the 
        // cutout shape with that color
        } else if (cells[0] == "none" && cells[1] !== "none" && cells[1] == cells[2]) {
          svgElement("path", {d: c, transform: "rotate(180)", fill: cells[1]}, grid);
        } else if (cells[0] !== "none" && cells[1] !== "none" && cells[2] !== "none" && cells[3] !== "none") {
          svgElement("path", {d: c, transform: "rotate(180)", fill: cells[0]}, grid);
        }

        // The rest of these statements follow the same pattern for each corner
        // of the block
        if (cells[1] && cells[1] !== "none") {
          svgElement("path", {d: qc, fill: cells[1], transform: "rotate(-90)"}, grid);
        }

        if (cells[1] !== "none" && 
          (cells[1] == cells[2] || cells[1] == cells[3] || cells[1] == cells[0])) {
          svgElement("path", {d: c, transform: "rotate(-90)", fill: cells[1]}, grid);
        } else if (cells[1] == "none" & cells[0] !== "none" && cells[0] == cells[3]) {
          svgElement("path", {d: c, transform: "rotate(-90)", fill: cells[0]}, grid);
        } else if (cells[1] !== "none" && cells[0] !== "none" && cells[2] !== "none" && cells[3] !== "none") {
          svgElement("path", {d: c, transform: "rotate(-90)", fill: cells[1]}, grid);
        }

        if (cells[2] && cells[2] !== "none") {  
          svgElement("path", {d: qc, fill: cells[2], transform: "rotate(90)"}, grid);
        }
        
        if (cells[2] !== "none" && 
          (cells[2] == cells[3] || cells[2] == cells[0] || cells[2] == cells[1])) {
            svgElement("path", {d: c, transform: "rotate(90)", fill: cells[2]}, grid);
        } else if (cells[2] == "none" && cells[0] !== "none" && cells[0] == cells[3]) {
          svgElement("path", {d: c, transform: "rotate(90)", fill: cells[0]}, grid);
        } else if (cells[2] !== "none" && cells[0] !== "none" && cells[1] !== "none" && cells[3] !== "none") {
          svgElement("path", {d: c, transform: "rotate(90)", fill: cells[2]}, grid);
        }

        if (cells[3] && cells[3] !== "none") {
          svgElement("path", {d: qc, fill: cells[3]}, grid);
        }

        if (cells[3] !== "none" && 
          (cells[3] == cells[0] || cells[3] == cells[1] || cells[3] == cells[2])) {
          svgElement("path", {d: c, fill: cells[3]}, grid);
        } else if (cells[3] == "none" && cells[1] !== "none" && cells[1] == cells[2]) {
          svgElement("path", {d: c, fill: cells[1]}, grid);
        } else if (cells[3] !== "none" && cells[0] !== "none" && cells[1] !== "none" && cells[2] !== "none") {
          svgElement("path", {d: c,  fill: cells[3]}, grid);
        }
      }
    }
  }
};
