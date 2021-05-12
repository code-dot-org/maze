import Subtype from './subtype';
import NeighborhoodCell from './neighborhoodCell';
import NeighborhoodDrawer from './neighborhoodDrawer';

module.exports = class Neighborhood extends Subtype {
  constructor(maze, config = {}) {
    super(maze, config);

    this.spriteMap = this.skin_.spriteMap;

    // TODO: these should be defined by the level
    this.initializeWithPlaceholder = true;
    this.squareSize = 50;
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
  initializeWithPlaceholderPegman() {
    return this.initializeWithPlaceholder;
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
      // each cell with either be a blank tile or an asset tile.
      // choose based on configuration of tile.
      const asset = this.drawer.getAsset('', row, col);
      if (asset) {
        // asset is in format {name: <>, sheet: x, row: y, column: z}
        this.drawTileHelper(
          asset.sheet, 
          [asset.row, asset.column], 
          row, 
          col, 
          tileId, 
          'auto', 
          'auto', 
          this.squareSize
        );
      } else {
        // draw blank tile
        this.drawTile(svg, [0, 0], row, col, tileId);
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
    const col = this.maze_.getPegmanX();
    const row = this.maze_.getPegmanY();

    const cell = this.getCell(row, col);
    cell.setColor(color);
    // TODO: update color on map
  }

  /**
   * Remove paint from the location of the pegman with id pegmanId, if there
   * is any paint.
   * @param {String} pegmanId
  **/ 
 removePaint(pegmanId) {
    const col = this.maze_.getPegmanX();
    const row = this.maze_.getPegmanY();

    const cell = this.getCell(row, col);
    cell.setColor(null);
    // TODO: remove color from map
  }

  // Sprite map maps asset ids to sprites within a spritesheet.
  getSpriteMap() {
    return this.spriteMap;
  }
}
