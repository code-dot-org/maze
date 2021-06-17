const { SVG_NS } = require("./drawer");
const Drawer = require("./drawer");
const tiles = require("./tiles");

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

    // If necessary, create padded rows with no color
    /* 
        0 1 2
        3 4 5
        6 7 8
        */
    let colors = [
      this.cellColor(row - 1, col - 1), // Top left
      this.cellColor(row, col - 1), // Top
      this.cellColor(row + 1, col - 1), // Top right
      this.cellColor(row - 1, col), // Middle left
      this.cellColor(row, col), // Middle
      this.cellColor(row + 1, col), // Middle right
      this.cellColor(row - 1, col + 1), // Bottom left
      this.cellColor(row, col + 1), // Bottom
      this.cellColor(row + 1, col + 1), // Bottom right
    ];

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (colors[1] && colors[1] == colors[3]) {
      context.beginPath();
      context.fillStyle = colors[1];
      context.moveTo(x * SIZE, y * SIZE);
      if (colors[0] == colors[3]) {
        context.lineTo((x + 0.4) * SIZE, y * SIZE);
        context.lineTo(x * SIZE, (y + 0.4) * SIZE);
      } else {
        context.lineTo((x + 1) * SIZE, y * SIZE);
        context.lineTo(x * SIZE, (y + 1) * SIZE);
      }
      context.fill();
    }

    if (colors[1] && colors[1] == colors[5]) {
      context.beginPath();
      context.fillStyle = colors[1];
      context.moveTo((x + 1) * SIZE, y * SIZE);
      if (colors[2] == colors[1]) {
        context.lineTo((x + 0.6) * SIZE, y * SIZE);
        context.lineTo((x + 1) * SIZE, (y + 0.4) * SIZE);
      } else {
        context.lineTo(x * SIZE, y * SIZE);
        context.lineTo((x + 1) * SIZE, (y + 1) * SIZE);
      }
      context.fill();
    }

    if (colors[7] && colors[7] == colors[3]) {
      context.beginPath();
      context.fillStyle = colors[7];
      context.moveTo(x * SIZE, (y + 1) * SIZE);
      if (colors[6] == colors[7]) {
        context.lineTo((x + 0.4) * SIZE, (y + 1) * SIZE);
        context.lineTo(x * SIZE, (y + 0.6) * SIZE);
      } else {
        context.lineTo(x * SIZE, y * SIZE);
        context.lineTo((x + 1) * SIZE, (y + 1) * SIZE);
      }
      context.fill();
    }

    if (colors[7] && colors[7] == colors[5]) {
      context.beginPath();
      context.fillStyle = colors[7];
      context.moveTo((x + 1) * SIZE, (y + 1) * SIZE);
      if (colors[8] == colors[7]) {
        context.lineTo((x + 1) * SIZE, (y + 0.6) * SIZE);
        context.lineTo((x + 0.6) * SIZE, (y + 1) * SIZE);
      } else {
        context.lineTo((x + 1) * SIZE, y * SIZE);
        context.lineTo(x * SIZE, (y + 1) * SIZE);
      }
      context.fill();
    }

    if (colors[4]) {
      context.beginPath();
      context.fillStyle = colors[4];
      if (
        colors[4] == colors[5] &&
        colors[4] == colors[7] &&
        colors[4] != colors[1] &&
        colors[4] != colors[3]
      ) {
        context.moveTo(x * SIZE, (y + 0.4) * SIZE);
        context.lineTo((x + 0.4) * SIZE, y * SIZE);
      } else {
        context.moveTo(x * SIZE, y * SIZE);
      }

      if (
        colors[4] == colors[3] &&
        colors[4] == colors[7] &&
        colors[4] != colors[1] &&
        colors[4] != colors[5]
      ) {
        context.lineTo((x + 0.6) * SIZE, y * SIZE);
        context.lineTo((x + 1) * SIZE, (y + 0.4) * SIZE);
      } else {
        context.lineTo((x + 1) * SIZE, y * SIZE);
      }

      if (
        colors[4] == colors[1] &&
        colors[4] == colors[3] &&
        colors[4] != colors[5] &&
        colors[4] != colors[7]
      ) {
        context.lineTo((x + 1) * SIZE, (y + 0.6) * SIZE);
        context.lineTo((x + 0.6) * SIZE, (y + 1) * SIZE);
      } else {
        context.lineTo((x + 1) * SIZE, (y + 1) * SIZE);
      }

      if (
        colors[4] == colors[1] &&
        colors[4] == colors[5] &&
        colors[4] != colors[3] &&
        colors[4] != colors[7]
      ) {
        context.lineTo((x + 0.4) * SIZE, (y + 1) * SIZE);
        context.lineTo(x * SIZE, (y + 0.6) * SIZE);
      } else {
        context.lineTo(x * SIZE, (y + 1) * SIZE);
      }

      context.fill();
    }
    return canvas;
  }
};
