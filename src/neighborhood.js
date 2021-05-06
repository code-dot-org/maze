import Subtype from './subtype';

module.exports = class Neighborhood extends Subtype {
  constructor(maze, config = {}) {
    super(maze, config);

    // TODO: this should be defined by the layout of the level
    this.initializeWithPlaceholder = true;
  }

  /**
   * @override
   */
  isNeighborhood() {
    return false;
  }
  
  /**
   * @override
   */
  allowMultiplePegmen() {
    return true;
  }

   /**
   * @override
   */
  initializeWithPlaceholderPegman() {
    return this.initializeWithPlaceholder;
  }
}