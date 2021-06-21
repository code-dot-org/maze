const { SVG_NS } = require("./drawer");
const Drawer = require("./drawer");
const tiles = require("./tiles");

const ROTATE180 = "rotate(180)";
const ROTATENEG90 = "rotate(-90)";
const ROTATE90 = "rotate(90)";
const ROTATE0 = "rotate(0)";
const TRIANGLE = "triangle";
const CENTER = "center";

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
    node.setAttribute(key, props[key]);
  });
  if (parent && id.startsWith("g")) {
    let pegmanElement = parent.getElementsByClassName("pegman-location")[0];
    parent.insertBefore(node, pegmanElement);
  } else if (parent) {
    parent.appendChild(node);
  }
  return node;
}

/// Methods assume that the upper lefthand corner is 0,0. These paths can be rotated to make all four corner possibilities
function smallCornerPathString() {
  return `M0,0 L${0.2 * this.squareSize},0 L0,${0.2 * this.squareSize} Z`;
}

function trianglePathString() {
  return `M0,0 L${this.squareSize},0 L0,${this.squareSize} Z`;
}

function generateTruncatedSquareString(
  topLeftIsTruncated,
  topRightIsTruncated,
  bottomRightIsTruncated,
  bottomLeftIsTruncated
) {
  const topLeftCorner = topLeftIsTruncated
    ? `M0,${this.squareSize * 0.2} L${this.squareSize * 0.2},0`
    : `M0,0`;
  const topRightCorner = topRightIsTruncated
    ? `L${this.squareSize * 0.3},0 L${this.squareSize},${this.squareSize * 0.2}`
    : `L${this.squareSize},0`;
  const bottomRightCorner = bottomRightIsTruncated
    ? `L${this.squareSize},${this.squareSize * 0.3} L${this.squareSize * 0.3},${
        this.squareSize
      }`
    : `L${this.squareSize},${this.squareSize}`;
  const bottomLeftCorner = bottomLeftIsTruncated
    ? `L${this.squareSize * 0.2},${this.squareSize} L0,${this.squareSize * 0.3}`
    : `L0,${this.squareSize}`;
  return `${topLeftCorner} ${topRightCorner} ${bottomRightCorner} ${bottomLeftCorner} Z`;
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
    super(map, "", svg);
    this.squareSize = squareSize;
    this.neighborhood = neighborhood;
    this.skin_ = skin;
  }

  /**
   * Set the color of this tile back to null, and remove any svg elements
   * (colors) that currently exist on this tile and its neighbors.
   *
   * @param row
   * @param col
   */
  resetTile(row, col) {
    let neighbors = [
      "g" + row + "." + col,
      "g" + (row - 1) + "." + (col - 1),
      "g" + row + "." + (col - 1),
      "g" + (row - 1) + "." + col,
    ];
    const cell = this.neighborhood.getCell(row, col);
    cell.setColor(null);
    for (const neighbor of neighbors) {
      var node = document.getElementById(neighbor);
      if (node) {
        node.querySelectorAll("*").forEach((n) => n.remove());
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
    if (
      cell.getAssetId() != null &&
      cell.getAssetId() > 0 &&
      cell.getTile() !== tiles.SquareType.START &&
      !cell.getOriginalValue()
    ) {
      return this.getSpriteData(cell);
    }
  }

  getSpriteData(cell) {
    return this.neighborhood.getSpriteMap()[cell.getAssetId()];
  }

  /**
   * Calls resetTile for each tile in the grid, clearing all paint.
   */
  resetTiles() {
    for (let row = 0; row < this.map_.ROWS; row++) {
      for (let col = 0; col < this.map_.COLS; col++) {
        this.resetTile(row, col);
      }
    }
  }

  // Quick helper to retrieve the color stored in this cell
  // Ensures 'padding cells' (row/col < 0) have no color
  cellColor(row, col) {
    if (row >= this.map_.ROWS || row < 0) return null;
    if (col >= this.map_.COLS || col < 0) return null;
    return this.map_.getCell(row, col).getColor() || null;
  }

  centerFill(center, top, right, bottom, left, transform, grid, id) {
    var path;
    if (center == top && center == right && center != bottom && center != left)
      path = generateTruncatedSquareString(false, false, false, true);
    if (center == right && center == bottom && center != left && center != top)
      path = generateTruncatedSquareString(true, false, false, false);
    if (center == bottom && center == left && center != top && center != right)
      path = generateTruncatedSquareString(false, true, false, false);
    if (center == left && center == top && center != right && center != bottom)
      path = generateTruncatedSquareString(false, false, true, false);

    svgElement(
      "path",
      {
        d: path,
        stroke: center,
        transform: transform,
        fill: center,
      },
      grid,
      `${id}-${CENTER}`
    );
  }

  // Helper method for determining color and path based on neighbors
  pathCalculator(
    subjectCell,
    adjacent1,
    adjacent2,
    diagonal,
    transform,
    grid,
    id
  ) {
    let triangle = trianglePathString();
    let tag = "path";

    // Add a quarter circle to the top left corner of the block if there is
    // a color value there
    if (subjectCell && adjacent1 === adjacent2 && adjacent1 === diagonal) {
      svgElement(
        tag,
        {
          d: triangle,
          stroke: subjectCell,
          transform: transform,
          fill: subjectCell,
        },
        grid,
        `${id}-${TRIANGLE}`
      );
    } else if (subjectCell && adjacent1 === adjacent2) {
      svgElement(
        tag,
        {
          d: triangle,
          stroke: subjectCell,
          transform: transform,
          fill: subjectCell,
        },
        grid,
        `${id}-${TRIANGLE}`
      );
    }
  }

  makeGrid(row, col, svg) {
    let id = "g" + row + "." + col;
    return svgElement(
      "g",
      {
        transform: `translate(${col * this.squareSize + this.squareSize}, 
        ${row * this.squareSize + this.squareSize})`,
      },
      svg,
      id
    );
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

  // Iterates through all neighborhood assets and inserts them after the pegman
  drawAssets() {
    let assetList = this.neighborhood.getAssetList();
    var i;
    for (i = 0; i < assetList.length; i++) {
      let asset = assetList[i];
      let node = document.getElementById(asset);
      let pegmanElement =
        this.svg_.getElementsByClassName("pegman-location")[0];
      this.svg_.insertBefore(node, pegmanElement);
    }
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
      const newValue = cell.getCurrentValue() > 0 ? cell.getCurrentValue() : "";
      // drawImage_ calls getAsset. If currentValue() is 0, getAsset will return
      // undefined and the paint can will be hidden. Otherwise we will get the paint can image.
      super.drawImage_("", itemRow, itemCol, this.squareSize);
      super.updateOrCreateText_(
        "counter",
        itemRow,
        itemCol,
        newValue,
        this.squareSize,
        1,
        1,
        "karel-counter-text paint"
      );
    }

    /*
    We process each tile based on the 8 surrounding, and cellColor() will
    simply return null if the neighboring cells are out of bounds

    0 1 2
    3 4 5
    6 7 8

    */

    let cells = [
      this.cellColor(row - 1, col - 1), // Top left
      this.cellColor(row, col - 1), // Top
      this.cellColor(row + 1, col - 1), // Top right
      this.cellColor(row - 1, col), // Middle left
      this.cellColor(row, col), // Target cell
      this.cellColor(row + 1, col), // Middle right
      this.cellColor(row - 1, col + 1), // Bottom left
      this.cellColor(row, col + 1), // Bottom
      this.cellColor(row + 1, col + 1), // Bottom right
    ];

    // Create grid block group
    let grid = this.makeGrid(row, col, this.svg_);
    let id0 = row + "." + col + "." + ROTATE180;
    let id1 = row + "." + col + "." + ROTATENEG90;
    let id2 = row + "." + col + "." + ROTATE90;
    let id3 = row + "." + col + "." + ROTATE0;
    let id4 = row + "." + col + "." + CENTER;

    // Calculate all the svg paths based on neighboring cell colors
    this.pathCalculator(
      cells[4],
      cells[1],
      cells[3],
      cells[0],
      ROTATE180,
      grid,
      id0
    );
    this.pathCalculator(
      cells[4],
      cells[1],
      cells[5],
      cells[2],
      ROTATENEG90,
      grid,
      id1
    );
    this.pathCalculator(
      cells[4],
      cells[5],
      cells[7],
      cells[8],
      ROTATE90,
      grid,
      id2
    );
    this.pathCalculator(
      cells[4],
      cells[7],
      cells[3],
      cells[6],
      ROTATE0,
      grid,
      id3
    );
    this.centerFill(
      cells[4],
      cells[1],
      cells[5],
      cells[7],
      cells[3],
      ROTATE0,
      grid,
      id4
    );
  }
};
