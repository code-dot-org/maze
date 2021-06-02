const { SVG_NS } = require("./drawer");
const Drawer = require('./drawer')
const tiles = require('./tiles');

const ROTATE180 = "rotate(180)";
const ROTATENEG90 = "rotate(-90)";
const ROTATE90 = "rotate(90)";
const ROTATE0 = "rotate(0)";
const CUT = "cut";
const PIE = "pie";

/**
 * This is a helper for creating SVG Elements. 
 * Groups are created by grid tile, under which paths are nested. These groups
 * begin with "g" in the id. By checking for this when determining its position
 * within the hierarchy, we can nest these groups just before the pegman,
 * ensuring the pegman will appear on top of the paint.
 * 
 * @param tag representing the element type, 'g' for group, 'path' for paths
 * @param props representing the details of the element
 * @param parent the parent it should be nested under
 * @param id the unique identifier, beginning with 'g' if a group element
 * @returns the element itself
 */
function svgElement(tag, props, parent, id) {
  var node = document.getElementById(id);
  if (!node) {
    node = document.createElementNS(SVG_NS, tag);
    node.setAttribute("id", id);
  }
  Object.keys(props).map(function (key) {
    node.setAttribute(key, props[key])
  });
  if (parent && id.startsWith("g")) {
    let pegmanElement = parent.getElementsByClassName('pegman-location')[0];
    parent.insertBefore(node, pegmanElement);
  }
  else if (parent) {
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

/**
 * This drawer hosts all paint glomming logic. 
 * A note on layering paint: If paint is applied on top of existing paint 
 * (that has not been removed/scraped), portions of the cell might still
 * display the first layer of paint. Example: [blue][blue] in layer 1 will
 * create a "pill" visual. If the second cell is then painted [yellow], the
 * yellow circle will appear on top, with the blue cutouts still visible below.
 */
module.exports = class NeighborhoodDrawer extends Drawer {

  constructor(map, skin, svg, squareSize, neighborhood) {
    super(map, '', svg);
    this.squareSize = squareSize;
    this.neighborhood = neighborhood;
    this.skin_ = skin;
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
    // only cells with a value are handled by getAsset.
    if (cell.getCurrentValue()) {
      return this.skin_.paintCan;
    }
  }

  getBackgroundTileInfo(row, col) {
    const cell = this.neighborhood.getCell(row, col);
    // If the tile has an asset id and it is > 0 (0 is a blank tile and will always be added),
    // return the sprite asset. 
    // Ignore the asset id if this is a start tile or the cell has an original value. 
    // Start tiles will handle placing the pegman separately,
    // and tiles with a value are paint cans, which are handled as images instead of background tiles.
    if (cell.getAssetId() != null && cell.getAssetId() > 0 &&
        cell.getTile() !== tiles.SquareType.START && !cell.getOriginalValue()) {
      return this.getSpriteData(cell);
    }
  }

  getSpriteData(cell) {
    return this.neighborhood.getSpriteMap()[cell.getAssetId()];
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
    let pie = quarterCircle(this.squareSize);
    let cutOut = cutout(this.squareSize);
    let tag = "path";

    // Add a quarter circle to the top left corner of the block if there is 
    // a color value there
    if (subjectCell) {
      svgElement(tag, {d: pie, stroke: subjectCell, transform: transform, fill: subjectCell}, grid, `${id}-${PIE}`);
    }
    // Add the cutout if the top left corner has a color and an adjacent cell
    // shares that color, filling in the top left quadrant of the block entirely
    if (subjectCell && (subjectCell === adjacent1 || subjectCell === adjacent2)) {
      svgElement(tag, {d: cutOut, stroke: subjectCell, transform: transform, fill: subjectCell}, grid, `${id}-${CUT}`);
    } 
    // Otherwise, if the two adjacent corners have the same color, add the 
    // cutout shape with that color
    else if (adjacent1 && adjacent1 === adjacent2 && 
      ((!diagonal || !subjectCell) || subjectCell !== diagonal)) {
      svgElement(tag, {d: cutOut, stroke: adjacent1, transform: transform, fill: adjacent1}, grid, `${id}-${CUT}`);
    }
    // Fill in center corner only if an adjacent cell has the same color, or if 
    // the diagonal cell is same color and either adjacent is empty
    // Note: this handles the "clover case", where we want each
    // cell to "pop" out with its own color if diagonals are matching
    else if (subjectCell && (adjacent1 === subjectCell || adjacent2 === subjectCell ||
      (diagonal === subjectCell && ((!adjacent1 || !adjacent2) || adjacent1 !== adjacent2)))) {
      svgElement(tag, {d: cutOut, stroke: subjectCell, transform: transform, fill: subjectCell}, grid, `${id}-${CUT}`);
    }
  }

  makeGrid(row, col, svg) {
    let id = "g" + row + "." + col;
    return svgElement("g", {
      transform: `translate(${col * this.squareSize + this.squareSize}, 
        ${row * this.squareSize + this.squareSize})`
    }, svg, id);
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
   * This method is used to display the paint and paint buckets.
   * It has to reprocess the entire grid to get the paint glomming correct, but
   * it only updates the bucket at the specified itemRow and itemCol if necessary. 
   * @param {number} itemRow: row of update
   * @param {number} itemCol: column of update
   * @param {boolean} running: if the maze is currently running (not used here, but part of signature of super)
   */
  updateItemImage(itemRow, itemCol, running) {
    let cell = this.map_.getCell(itemRow, itemCol);

    // if the cell value has ever been greater than 0, this has been or 
    // is a paint can square. Ensure it is shown/hidden appropriately 
    // and with the correct value.
    if (cell.getOriginalValue() > 0) {
      const newValue = cell.getCurrentValue() > 0 ? cell.getCurrentValue() : '';
      // drawImage_ calls getAsset. If currentValue() is 0, getAsset will return
      // undefined and the paint can will be hidden. Otherwise we will get the paint can image.
      super.drawImage_('', itemRow, itemCol, this.squareSize);
      super.updateOrCreateText_('counter', itemRow, itemCol, newValue, this.squareSize, 1, 1, 'karel-counter-text paint');
    }

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
          let grid = this.makeGrid(row, col, this.svg_);
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
