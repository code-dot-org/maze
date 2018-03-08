const Subtype = require('./subtype')

module.exports = class Farmer extends Subtype {

  /**
   * @override
   */
  isFarmer() {
    return true;
  }
}
