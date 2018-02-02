import React from 'react';
import ReactDOM from 'react-dom';

import MazeMap from './mazeMap';
import Visualization from './Visualization';
import drawMap from './drawMap';
import { getSubtypeForSkin } from './utils';

export default class Maze {

  constructor(config) {
    this.skin = config.skin;
    this.level = config.level;
    const Type = getSubtypeForSkin(config.skinId);
    this.subtype = new Type(this, config.studioApp, config);

    this.loadLevel();
    ReactDOM.render(
      <Visualization
        onMount={this.onMount}
      />,
      document.getElementById(config.containerId)
    );
  }

  onMount = () => {
    const svg = document.getElementById('svgMaze');
    this.map.resetDirt();

    this.subtype.initStartFinish();
    this.subtype.createDrawer(svg);
    this.subtype.initWallMap();


    // Adjust outer element size.
    svg.setAttribute('width', this.MAZE_WIDTH);
    svg.setAttribute('height', this.MAZE_HEIGHT);

    drawMap(svg, this.skin, this.subtype, this.map, this.SQUARE_SIZE);
    this.createAnimations(svg);
  }

  createAnimations(svg) {
    // TODO
  }

  loadLevel() {
    this.map = MazeMap.deserialize(this.level.serializedMaze, this.subtype.getCellClass());

    this.startDirection = this.level.startDirection;

    this.animating_ = false;

    // Override scalars.
    for (var key in this.level.scale) {
      this.scale[key] = this.level.scale[key];
    }

    // Pixel height and width of each maze square (i.e. tile).
    this.SQUARE_SIZE = 50;
    this.PEGMAN_HEIGHT = this.skin.pegmanHeight || this.SQUARE_SIZE;
    this.PEGMAN_WIDTH = this.skin.pegmanWidth || this.SQUARE_SIZE;
    this.PEGMAN_X_OFFSET = this.skin.pegmanXOffset || 0;
    this.PEGMAN_Y_OFFSET = this.skin.pegmanYOffset || 0;

    this.MAZE_WIDTH = this.SQUARE_SIZE * this.map.COLS;
    this.MAZE_HEIGHT = this.SQUARE_SIZE * this.map.ROWS;
    this.PATH_WIDTH = this.SQUARE_SIZE / 3;
  }

  /**
   * Schedule to add dirt at pegman's current position.
   */
  scheduleFill() {
    this.scheduleDirtChange({
      amount: 1,
      sound: 'fill'
    });
  }
  
  /**
   * Schedule to remove dirt at pegman's current location.
   */
  scheduleDig() {
    this.scheduleDirtChange({
      amount: -1,
      sound: 'dig'
    });
  }

  scheduleDirtChange(options) {
    var col = this.pegmanX;
    var row = this.pegmanY;
  
    // cells that started as "flat" will be undefined
    var previousValue = this.map.getValue(row, col) || 0;
  
    this.map.setValue(row, col, previousValue + options.amount);
    this.subtype.scheduleDirtChange(row, col);
  }
}
