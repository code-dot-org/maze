import Subtype from './subtype';
import NeighborhoodCell from './neighborhoodCell';
import NeighborhoodDrawer from './neighborhoodDrawer';

module.exports = class Neighborhood extends Subtype {
  constructor(maze, config = {}) {
    super(maze, config);
    this.spriteMap = this.skin_.spriteMap;
    this.sheetRows = this.skin_.sheetRows;

    // TODO: these should be defined by the level
    this.initializeWithPlaceholder = true;
    this.squareSize = 50;
    this.drawer = null;
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
    this.drawer.drawMapTiles(svg);
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

  // Get dimensions for spritesheet of static images.
  getDimensionsForSheet(sheet) {
    return [10 * this.squareSize, this.sheetRows[sheet] * this.squareSize];
  }
}
