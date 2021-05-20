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
   * 
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

    // TODO: remove this demo
    this.paintGlommingDemo('blue');
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
    this.drawer.updateItemImage(row, col, true);
  }

  // This is to show the two steps required to ensure paint is added
  paintGlommingDemo(color) {
    this.getCell(0, 0).setColor(color);
    this.getCell(1, 1).setColor(color);
    this.getCell(0, 1).setColor('green');
    this.getCell(1, 0).setColor('green');
    this.drawer.updateItemImage(1, 0, true);
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
