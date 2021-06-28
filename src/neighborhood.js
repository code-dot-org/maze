import Subtype from "./subtype";
import NeighborhoodCell from "./neighborhoodCell";
import NeighborhoodSquareDrawer from "./neighborhoodSquareDrawer";
import NeighborhoodCircleDrawer from "./neighborhoodCircleDrawer";
import { Direction } from "./tiles";

module.exports = class Neighborhood extends Subtype {
  constructor(maze, config = {}) {
    super(maze, config);
    this.spriteMap = this.skin_.spriteMap;
    this.sheetRows = this.skin_.sheetRows;

    this.squareSize = this.skin_.squareSize;
    this.assetList = [];
  }

  /**
   * @override
   */
  isNeighborhood() {
    return true;
  }

  /**
   * @override
   */
  allowMultiplePegmen() {
    return true;
  }

  /**
   * @override
   */
  getCellClass() {
    return NeighborhoodCell;
  }

  /**
   * @override
   * Draw the tiles making up the maze map.
   */
  drawMapTiles(svg) {
    // Compute and draw the tile for each square.
    let tileId = 0;
    this.maze_.map.forEachCell((cell, row, col) => {
      // draw blank tile
      this.drawTile(svg, [0, 0], row, col, tileId);

      const asset = this.drawer.getBackgroundTileInfo(row, col);
      if (asset) {
        // add asset id to the assetList
        this.assetList.push("tileElement" + `${tileId}-asset`);
        // add assset on top of blank tile if it exists
        // asset is in format {name: 'sample name', sheet: x, row: y, column: z}
        const assetHref = this.skin_.assetUrl(asset.sheet);
        const [sheetWidth, sheetHeight] = this.getDimensionsForSheet(
          asset.sheet
        );
        this.drawer.drawTileHelper(
          svg,
          [asset.column, asset.row],
          row,
          col,
          `${tileId}-asset`,
          assetHref,
          sheetWidth,
          sheetHeight,
          this.squareSize
        );
      }
      this.drawer.updateItemImage(row, col, false);
      tileId++;
    });
  }

  /**
   * @override
   **/
  createDrawer(svg, drawer = "square") {
    if (drawer === "square") {
      this.drawer = new NeighborhoodSquareDrawer(
        this.maze_.map,
        this.skin_,
        svg,
        this.squareSize,
        this
      );
    } else {
      this.drawer = new NeighborhoodCircleDrawer(
        this.maze_.map,
        this.skin_,
        svg,
        this.squareSize,
        this
      );
    }
  }

  /**
   * Paint the current location of the pegman with id pegmanId.
   * @param {String} pegmanId
   * @param {String} color Color to paint current location.
   *                       Must be hex code or html color.
   **/
  addPaint(pegmanId, color) {
    const col = this.maze_.getPegmanX(pegmanId);
    const row = this.maze_.getPegmanY(pegmanId);

    const cell = this.getCell(row, col);
    cell.setColor(color);
    this.drawer.updateItemImage(row, col, true);
    this.drawer.drawAssets();
  }

  /**
   * Remove paint from the location of the pegman with id pegmanId.
   * @param {String} pegmanId
   **/
  removePaint(pegmanId) {
    const col = this.maze_.getPegmanX(pegmanId);
    const row = this.maze_.getPegmanY(pegmanId);

    this.drawer.resetTile(row, col);
    this.drawer.updateItemImage(row, col, true);
    this.drawer.drawAssets();
  }

  /**
   * Turns the painter left by one direction.
   * @param {String} pegmanId
   */
  turnLeft(pegmanId) {
    let newDirection = null;
    switch (this.maze_.getPegmanD(pegmanId)) {
      case Direction.NORTH:
        newDirection = Direction.WEST;
        break;
      case Direction.EAST:
        newDirection = Direction.NORTH;
        break;
      case Direction.SOUTH:
        newDirection = Direction.EAST;
        break;
      case Direction.WEST:
        newDirection = Direction.SOUTH;
        break;
    }
    this.maze_.animatedCardinalTurn(newDirection, pegmanId);
  }

  takePaint(pegmanId) {
    const col = this.maze_.getPegmanX(pegmanId);
    const row = this.maze_.getPegmanY(pegmanId);

    const cell = this.getCell(row, col);
    cell.setCurrentValue(cell.getCurrentValue() - 1);
    this.drawer.updateItemImage(row, col, true);
  }

  reset() {
    this.drawer.resetTiles();
  }

  // Sprite map maps asset ids to sprites within a spritesheet.
  getSpriteMap() {
    return this.spriteMap;
  }

  // Get dimensions for spritesheet of static images.
  getDimensionsForSheet(sheet) {
    return [10 * this.squareSize, this.sheetRows[sheet] * this.squareSize];
  }

  // Retrieve the asset list
  getAssetList() {
    return this.assetList;
  }
};
