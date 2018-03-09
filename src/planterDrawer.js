const Drawer = require('./drawer')

module.exports = class PlanterDrawer extends Drawer {
  constructor(map, skin, svg, subtype) {
    super(map, '', svg);
    this.skin_ = skin;
    this.subtype_ = subtype;
  }

  /**
   * @override
   */
  getAsset(prefix, row, col) {
    const crop = this.subtype_.getCell(row, col).featureName();
    return this.skin_[crop];
  }
}
