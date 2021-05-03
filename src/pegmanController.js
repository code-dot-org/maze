const Pegman = require('./pegman');

module.exports =  class PegmanController {
  constructor() {
    this.pegmen = {};
    this.firstPegman = null;
  }

  getOrCreatePegman(id = null) {
    let pegman = this.getPegman(id);
    if (!pegman) {
      pegman = new Pegman(null, null, null, id);
      this.addPegman(pegman);
    }
    return pegman;
  }

  getPegman(id = null) {
    if (id == null) {
      return this.firstPegman;
    } else {
      return this.pegmen[id];
    }
  }
 
  addPegman(pegman) {
    // if this is the first pegman added, store as firstPegman
    if (this.firstPegman === null) {
      this.firstPegman = pegman;
    }
    // if the pegman has an id, put it in this.pegmen
    // pegmen without ids cannot be accessed via this.pegmen.
    if (pegman.id != null) {
      this.pegmen[pegman.id] = pegman;
    }
  }
}
