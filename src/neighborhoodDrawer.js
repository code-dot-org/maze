const Drawer = require('./drawer')

const SQUARE_SIZE = 50;
const SVG_NS = 'http://www.w3.org/2000/svg';

module.exports = class NeighborhoodDrawer extends Drawer {
  /**
   * Draw the given tile at row, col
   */
  drawTile(svg, tileSheetLocation, row, col, tileId, tileSheetHref) {
    const [left, top] = tileSheetLocation;

    const tileSheetWidth = SQUARE_SIZE;
    const tileSheetHeight = SQUARE_SIZE;

    // Tile's clipPath element.
    const tileClip = document.createElementNS(SVG_NS, 'clipPath');
    tileClip.setAttribute('id', 'tileClipPath' + tileId);
    const tileClipRect = document.createElementNS(SVG_NS, 'rect');
    tileClipRect.setAttribute('width', SQUARE_SIZE);
    tileClipRect.setAttribute('height', SQUARE_SIZE);

    tileClipRect.setAttribute('x', col * SQUARE_SIZE);
    tileClipRect.setAttribute('y', row * SQUARE_SIZE);
    tileClip.appendChild(tileClipRect);
    svg.appendChild(tileClip);

    // Tile sprite.
    const tileElement = document.createElementNS(SVG_NS, 'image');
    tileElement.setAttribute('id', 'tileElement' + tileId);
    tileElement.setAttributeNS('http://www.w3.org/1999/xlink',
                              'xlink:href', tileSheetHref);
    tileElement.setAttribute('height', tileSheetHeight);
    tileElement.setAttribute('width', tileSheetWidth);
    tileElement.setAttribute('clip-path',
                            'url(#tileClipPath' + tileId + ')');
    tileElement.setAttribute('x', (col - left) * SQUARE_SIZE);
    tileElement.setAttribute('y', (row - top) * SQUARE_SIZE);
    svg.appendChild(tileElement);

    // Tile animation
    const tileAnimation = document.createElementNS(SVG_NS, 'animate');
    tileAnimation.setAttribute('id', 'tileAnimation' + tileId);
    tileAnimation.setAttribute('attributeType', 'CSS');
    tileAnimation.setAttribute('attributeName', 'opacity');
    tileAnimation.setAttribute('from', 1);
    tileAnimation.setAttribute('to', 0);
    tileAnimation.setAttribute('dur', '1s');
    tileAnimation.setAttribute('begin', 'indefinite');
    tileElement.appendChild(tileAnimation);
  }
}