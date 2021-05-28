import Subtype from './subtype';
import NeighborhoodCell from './neighborhoodCell';
import NeighborhoodDrawer from './neighborhoodDrawer';
import { Direction } from './tiles';

module.exports = class Neighborhood extends Subtype {
  constructor(maze, config = {}) {
    super(maze, config);
    this.spriteMap = this.skin_.spriteMap;
    this.sheetRows = this.skin_.sheetRows;

    this.squareSize = this.skin_.squareSize;
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
      const asset = this.drawer.getAsset('', row, col);

      // draw blank tile
      this.drawTile(svg, [0, 0], row, col, tileId);
      if (asset) {
        // add assset on top of blank tile if it exists
        // asset is in format {name: 'sample name', sheet: x, row: y, column: z}
        const assetHref = this.skin_.assetUrl(asset.sheet);
        const [sheetWidth, sheetHeight] = this.getDimensionsForSheet(asset.sheet);
        this.drawer.drawTileHelper(
          svg, 
          [asset.column, asset.row], 
          row, 
          col, 
          tileId, 
          assetHref,
          sheetWidth, 
          sheetHeight, 
          this.squareSize
        );
      }
      tileId++;
    });
  }

  /** 
   * @override 
  **/
  createDrawer(svg) {
    this.drawer = new NeighborhoodDrawer(this.maze_.map, this.skin_, svg, this.squareSize, this);
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
  }

  /**
   * Remove paint from the location of the pegman with id pegmanId, if there
   * is any paint.
   * @param {String} pegmanId
  **/ 
 removePaint(pegmanId) {
    const col = this.maze_.getPegmanX(pegmanId);
    const row = this.maze_.getPegmanY(pegmanId);

    const cell = this.getCell(row, col);
    cell.setColor(null);
    this.drawer.resetTile(row, col);
    this.drawer.updateItemImage(row, col, true);
  }

  /**
   * Turns the painter left by one direction.
   * @param {String} pegmanId
   */
  turnLeft(pegmanId) {
    const newDirection = null;
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
    this.maze_.animatedTurn(newDirection, pegmanId);
  }

  // Sprite map maps asset ids to sprites within a spritesheet.
  getSpriteMap() {
    return this.spriteMap;
  }

  // Get dimensions for spritesheet of static images.
  getDimensionsForSheet(sheet) {
    return [10 * this.squareSize, this.sheetRows[sheet] * this.squareSize];
  }
}
