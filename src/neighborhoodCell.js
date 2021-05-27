const Cell = require('./cell');

module.exports = class NeighborhoodCell extends Cell {
  // value is paint count
  constructor(tileType, value, assetId, color) {
    super(tileType, value);
    this.assetId = assetId;
    this.color = color;
  }

  getColor() {
    return this.color;
  }

  setColor(color) {
    this.color = color;
  }

  getAssetId() {
    return this.assetId;
  }

  /**
   * Serializes this NeighborhoodCell into JSON
   * @return {Object}
   * @override
   */
  serialize() {
    return {
      ...super.serialize(),
      assetId: this.assetId,
      color: this.color
    };
  }

  /**
   * @override
   */
  static deserialize(serialized) {
    return new NeighborhoodCell(
      serialized.tileType,
      serialized.value,
      serialized.assetId,
      serialized.color
    );
  }
}
