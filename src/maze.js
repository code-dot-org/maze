import React from 'react';
import ReactDOM from 'react-dom';

import MazeMap from './mazeMap';
import Visualization from './Visualization';
import drawMap, { displayPegman } from './drawMap';
import { getSubtypeForSkin, rotate2DArray, range } from './utils';
import { directionToDxDy, directionToFrame } from './tiles';

export default class Maze {

  init(config) {
    this.scale = {
      snapRadius: 1,
      stepSpeed: 5
    };

    this.skin = config.skin;
    this.level = config.level;

    if (this.level.map && this.level.shapeShift) {
      for (let i = 1, max = Math.random() * 4; i < max; i++) {
        this.level.map = rotate2DArray(this.level.map);
        this.level.startDirection = (this.level.startDirection + 3) % 4;
      }
    }

    const Type = getSubtypeForSkin(config.skinId);
    this.subtype = new Type(this, config.studioApp, config);

    // load level
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

  render(containerId) {
    ReactDOM.render(
      <Visualization
        onMount={this.onMount}
      />,
      document.getElementById(containerId)
    );
  }

  // TODO figure out how to make eslint okay with class properties
  // eslint-disable-next-line no-undef
  onMount = () => {
    const svg = document.getElementById('svgMaze');
    this.map.resetDirt();

    this.subtype.initStartFinish();
    this.subtype.createDrawer(svg);
    this.subtype.initWallMap();

    this.pegmanX = this.subtype.start.x;
    this.pegmanY = this.subtype.start.y;
    this.pegmanD = this.startDirection;

    // Adjust outer element size.
    svg.setAttribute('width', this.MAZE_WIDTH);
    svg.setAttribute('height', this.MAZE_HEIGHT);

    drawMap(svg, this.skin, this.subtype, this.map, this.SQUARE_SIZE);
    this.createAnimations(svg);
  }

  createAnimations(svg) {
    // TODO
  }

  animatedMove(direction, timeForMove) {
    const positionChange = directionToDxDy(direction);
    const newX = this.pegmanX + positionChange.dx;
    const newY = this.pegmanY + positionChange.dy;
    this.scheduleMove(newX, newY, timeForMove);
    this.pegmanX = newX;
    this.pegmanY = newY;
  }

  /**
   * Schedule the animations for a move from the current position
   * @param {number} endX X coordinate of the target position
   * @param {number} endY Y coordinate of the target position
   */
  scheduleMove(endX, endY, timeForAnimation) {
    var startX = this.pegmanX;
    var startY = this.pegmanY;
    var direction = this.pegmanD;

    var deltaX = (endX - startX);
    var deltaY = (endY - startY);
    var numFrames;
    var timePerFrame;

    if (this.skin.movePegmanAnimation) {
      numFrames = this.skin.movePegmanAnimationFrameNumber;
      // If move animation of pegman is set, and this is not a turn.
      // Show the animation.
      var pegmanIcon = document.getElementById('pegman');
      var movePegmanIcon = document.getElementById('movePegman');
      timePerFrame = timeForAnimation / numFrames;

      this.scheduleSheetedMovement({
          x: startX,
          y: startY
        }, {
          x: deltaX,
          y: deltaY
        },
        numFrames, timePerFrame, 'move', direction, true);

      // Hide movePegman and set pegman to the end position.
      //timeoutList.setTimeout(function () {
      setTimeout(() => {
        movePegmanIcon.setAttribute('visibility', 'hidden');
        pegmanIcon.setAttribute('visibility', 'visible');
        this.displayPegman(endX, endY, directionToFrame(direction));
        if (this.subtype.isWordSearch()) {
          this.subtype.markTileVisited(endY, endX, true);
        }
      }, timePerFrame * numFrames);
    } else {
      // we don't have an animation, so just move the x/y pos
      numFrames = 4;
      timePerFrame = timeForAnimation / numFrames;
      range(1, numFrames).forEach((frame) => {
        //timeoutList.setTimeout(function () {
        setTimeout(() => {
          this.displayPegman(
            startX + deltaX * frame / numFrames,
            startY + deltaY * frame / numFrames,
            directionToFrame(direction));
        }, timePerFrame * frame);
      });
    }

    if (this.skin.approachingGoalAnimation) {
      var finishIcon = document.getElementById('finish');
      // If pegman is close to the goal
      // Replace the goal file with approachingGoalAnimation
      if (this.subtype.finish && Math.abs(endX - this.subtype.finish.x) <= 1 &&
          Math.abs(endY - this.subtype.finish.y) <= 1) {
        finishIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
          this.skin.approachingGoalAnimation);
      } else {
        finishIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
          this.skin.goalIdle);
      }
    }

    //studioApp().playAudio('walk');
  }

  /**
   * Display Pegman at the specified location, facing the specified direction.
   * @param {number} x Horizontal grid (or fraction thereof).
   * @param {number} y Vertical grid (or fraction thereof).
   * @param {number} frame Direction (0 - 15) or dance (16 - 17).
   */
  displayPegman(x, y, frame) {
    var pegmanIcon = document.getElementById('pegman');
    var clipRect = document.getElementById('clipRect');
    displayPegman(this.skin, pegmanIcon, clipRect, x, y, frame);
  }

  //
  //
  // TODO stuff below this comment should probably be moved into Subtype
  //
  //

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
