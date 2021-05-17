const Drawer = require('./drawer')

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

  /**
   * @override
   * Draw the given tile at row, col
   */
  drawTile(svg, tileSheetLocation, row, col, tileId, tileSheetHref) {
    // we have one background tile for neighborhood (we don't define paths like
    // the other skins). Therefore our 'tile sheet' is just one square.
    const tileSheetWidth = this.squareSize;
    const tileSheetHeight = this.squareSize;

    this.drawTileHelper(
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
}
