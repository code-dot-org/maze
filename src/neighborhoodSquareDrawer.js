const { SVG_NS } = require("./drawer");
const Drawer = require("./drawer");
const tiles = require("./tiles");

const TRIANGLE = "triangle";
const SMALLTRI = "smallCorner";
const CENTER = "center";
const PATH = "path";

const Corner = Object.freeze({
  topLeft: "topLeft",
  topRight: "topRight",
  bottomLeft: "bottomLeft",
  bottomRight: "bottomRight",
});

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

/**
 * The following functions create SVGs for the small corner cutouts
 *
 * @param color the stroke and fill colors
 * @param grid the parent element
 * @param id the id label
 * @param size the square size
 * @param corner the enum stating which corner to draw
 */
function smallCornerSvg(color, grid, id, size, corner) {
  let finalId;
  let shape;
  if (corner === Corner.topLeft) {
    finalId = `${id}-${SMALLTRI}-tl`;
    shape = `m0,0 L${0.3 * size},0 L0,${0.3 * size} Z`;
  } else if (corner === Corner.topRight) {
    finalId = `${id}-${SMALLTRI}-tr`;
    shape = `m${size},0 L${0.7 * size},0 L${size},${0.3 * size} Z`;
  } else if (corner === Corner.bottomLeft) {
    finalId = `${id}-${SMALLTRI}-bl`;
    shape = `m0,${size} L0,${0.7 * size} L${0.3 * size},${size} Z`;
  } else if (corner === Corner.bottomRight) {
    finalId = `${id}-${SMALLTRI}-br`;
    shape = `m${size},${size} L${0.7 * size},${size} L${size},${0.7 * size} Z`;
  }
  svgElement(
    PATH,
    {
      d: shape,
      stroke: color,
      fill: color,
    },
    grid,
    finalId
  );
}

/**
 * Returns the svg element for the half-grid triangle depending on which
 * corner is the source.
 *
 * @param color the stroke and fill colors
 * @param grid the parent element
 * @param id the id label
 * @param size the square size
 * @param corner the enum stating which corner to draw
 */
function triangleSvg(color, grid, id, size, corner) {
  let finalId;
  let shape;
  if (corner === Corner.topLeft) {
    finalId = `${id}-${TRIANGLE}-tl`;
    shape = `m0,0 L${size},0 L0,${size} Z`;
  } else if (corner === Corner.topRight) {
    finalId = `${id}-${TRIANGLE}-tr`;
    shape = `m${size},0 L${size},${size} L0,0 Z`;
  } else if (corner === Corner.bottomLeft) {
    finalId = `${id}-${TRIANGLE}-bl`;
    shape = `m0,${size} L${size},${size} L0,0 Z`;
  } else if (corner === Corner.bottomRight) {
    finalId = `${id}-${TRIANGLE}-br`;
    shape = `m${size},${size} L${size},0 L0,${size} Z`;
  }
  svgElement(
    PATH,
    {
      d: shape,
      stroke: color,
      fill: color,
    },
    grid,
    finalId
  );
}

function generateCenterPath(
  size,
  topLeftIsTruncated,
  topRightIsTruncated,
  bottomRightIsTruncated,
  bottomLeftIsTruncated
) {
  const topLeftCorner = topLeftIsTruncated
    ? `m0,${size * 0.3} L${size * 0.3},0`
    : `m0,0`;
  const topRightCorner = topRightIsTruncated
    ? `L${size * 0.7},0 L${size},${size * 0.3}`
    : `L${size},0`;
  const bottomRightCorner = bottomRightIsTruncated
    ? `L${size},${size * 0.7} L${size * 0.7},${size}`
    : `L${size},${size}`;
  const bottomLeftCorner = bottomLeftIsTruncated
    ? `L${size * 0.3},${size} L0,${size * 0.7}`
    : `L0,${size}`;
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

  /**
   * Determines how much of this tile should be colored in based on the colors
   * of the adjacent neighbors.
   */
  centerFill(center, top, right, bottom, left, grid, id) {
    var path;
    if (center == top && center == right && center != bottom && center != left)
      path = generateCenterPath(this.squareSize, false, false, false, true);
    else if (
      center == right &&
      center == bottom &&
      center != left &&
      center != top
    )
      path = generateCenterPath(this.squareSize, true, false, false, false);
    else if (
      center == bottom &&
      center == left &&
      center != top &&
      center != right
    )
      path = generateCenterPath(this.squareSize, false, true, false, false);
    else if (
      center == left &&
      center == top &&
      center != right &&
      center != bottom
    )
      path = generateCenterPath(this.squareSize, false, false, true, false);
    else {
      path = generateCenterPath(this.squareSize, false, false, false, false);
    }
    svgElement(
      "path",
      {
        d: path,
        stroke: center,
        fill: center,
      },
      grid,
      `${id}-${CENTER}`
    );
  }

  /**
   * Holds the bulk of the logic of coloring based on neighbor cells. The order
   * of cells in the input list is as follows:
   *
   * 0 1 2
   * 3 4 5
   * 6 7 8
   *
   * @param cellList representing the center (4) and its 8 surrounding
   * @param grid the parent element we will add svg elements to
   * @param id the row and column we're on in id form
   */
  pathCalculator(cellList, grid, id) {
    let size = this.squareSize;
    let center = cellList[4];
    let top = cellList[1];
    let right = cellList[5];
    let bottom = cellList[7];
    let left = cellList[3];

    // if the center cell has paint, calculate its fill and corners
    if (center) {
      this.centerFill(center, top, right, bottom, left, grid, id);
    }
    // the circle case: ensure the center cell only has small corners
    else if (
      top &&
      left &&
      bottom &&
      right &&
      top === left &&
      left === bottom &&
      bottom === right
    ) {
      smallCornerSvg(top, grid, id, size, Corner.topLeft);
      smallCornerSvg(top, grid, id, size, Corner.topRight);
      smallCornerSvg(bottom, grid, id, size, Corner.bottomLeft);
      smallCornerSvg(bottom, grid, id, size, Corner.bottomRight);
    } else {
      // Check each set of adjacent neighbors and corner cell to determine if
      // small corners or triangle half-grids should be drawn
      if (top && right && top === right) {
        if (cellList[2] && cellList[2] === top) {
          smallCornerSvg(top, grid, id, size, Corner.topRight);
        } else {
          triangleSvg(top, grid, id, size, Corner.topRight);
        }
      }
      if (right && bottom && right === bottom) {
        if (cellList[8] && cellList[8] === right) {
          smallCornerSvg(right, grid, id, size, Corner.bottomRight);
        } else {
          triangleSvg(top, grid, id, size, Corner.bottomRight);
        }
      }
      if (bottom && left && bottom === left) {
        if (cellList[6] && cellList[6] === bottom) {
          smallCornerSvg(bottom, grid, id, size, Corner.bottomLeft);
        } else {
          triangleSvg(top, grid, id, size, Corner.bottomLeft);
        }
      }
      if (left && top && left === top) {
        if (cellList[0] && cellList[0] === left) {
          smallCornerSvg(left, grid, id, size, Corner.topLeft);
        } else {
          triangleSvg(top, grid, id, size, Corner.topLeft);
        }
      }
    }
  }

  // Creates the parent svg for this grid tile
  makeGrid(row, col, svg) {
    let id = "g" + row + "." + col;
    return svgElement(
      "g",
      {
        transform: `translate(${col * this.squareSize}, 
        ${row * this.squareSize})`,
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
   * it only updates the bucket at the specified row and col if necessary.
   * @param {number} row: row of update
   * @param {number} col: column of update
   * @param {boolean} running: if the maze is currently running (not used here, but part of signature of super)
   */
  updateItemImage(row, col, running) {
    let cell = this.map_.getCell(row, col);

    // if the cell value has ever been greater than 0, this has been or
    // is a paint can square. Ensure it is shown/hidden appropriately
    // and with the correct value.
    if (cell.getOriginalValue() > 0) {
      const newValue = cell.getCurrentValue() > 0 ? cell.getCurrentValue() : "";
      // drawImage_ calls getAsset. If currentValue() is 0, getAsset will return
      // undefined and the paint can will be hidden. Otherwise we will get the paint can image.
      super.drawImage_("", row, col, this.squareSize);
      super.updateOrCreateText_(
        "counter",
        row,
        col,
        newValue,
        this.squareSize,
        1,
        1,
        "karel-counter-text paint"
      );
    }

    // Only calculate colors for all neighbors if this cell has a color
    if (this.cellColor(row, col)) {
      for (let r = row - 1; r < row + 2; r++) {
        for (let c = col - 1; c < col + 2; c++) {
          let id = r + "." + c + ".";

          let cells = [
            this.cellColor(r - 1, c - 1), // Top left
            this.cellColor(r - 1, c), // Top
            this.cellColor(r - 1, c + 1), // Top right
            this.cellColor(r, c - 1), // Middle left
            this.cellColor(r, c), // Target cell
            this.cellColor(r, c + 1), // Middle right
            this.cellColor(r + 1, c - 1), // Bottom left
            this.cellColor(r + 1, c), // Bottom
            this.cellColor(r + 1, c + 1), // Bottom right
          ];

          // Create grid block group for this center focus cell
          let grid = this.makeGrid(r, c, this.svg_);

          // Calculate all the svg paths based on neighboring cell colors
          this.pathCalculator(cells, grid, id);
        }
      }
    }
  }
};
