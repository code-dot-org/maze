const Cell = require('./cell');

module.exports = class NeighborhoodCell extends Cell {
  // value is paint count
  constructor(tileType, value, isBucket, color) {
    super(tileType);
    this.isBucket = isBucket;
    this.color = color;
  }
  isBucket() {
    return this.isBucket;
  }

  getColor() {
    return this.color;
  }

  setColor(color) {
    this.color = color;
  }
}