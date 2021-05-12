const Cell = require('./cell');

module.exports = class NeighborhoodCell extends Cell {
  // value is paint count
  constructor(tileType, value, hasBucket, color) {
    super(tileType, value);
    this.hasBucket = hasBucket;
    this.color = color;
  }

  hasBucket() {
    return this.hasBucket;
  }

  getColor() {
    return this.color;
  }

  setColor(color) {
    this.color = color;
  }
}
