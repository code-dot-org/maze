const Cell = require('./cell');

module.exports = class NeighborhoodCell extends Cell {
  // value is paint count
  constructor(tileType, value, assetId, hasBucket, color) {
    super(tileType, value);
    this.assetId = assetId;
    this.hasBucket = hasBucket || value > 0;
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

  getAssetId(assetId) {
    this.assetId = assetId;
  }

  /**
   * Serializes this NeighborhoodCell into JSON
   * @return {Object}
   * @override
   */
  serialize() {
    return Object.assign({}, super.serialize(), {
      tileType: this.tileType,
      value: this.value,
      assetId: this.assetId,
      hasBucket: this.hasBucket,
      color: this.color
    });
  }

  /**
   * @override
   */
  static deserialize(serialized) {
    return new NeighborhoodCell(
      serialized.tileType,
      serialized.value,
      serialized.assetId,
      serialized.hasBucket,
      serialized.color
    );
  }
}
