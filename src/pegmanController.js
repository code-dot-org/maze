const Pegman = require('./pegman');

const DEFAULT_ID = 'defaultPegman';

module.exports =  class PegmanController {

  constructor() {
    this.pegmen = {};
  }

  getOrCreatePegman(id) {
    // if id is null or undefined, set to default value.
    if(id == undefined) {
      id = DEFAULT_ID;
    }
    let pegman = this.getPegman(id);
    if (!pegman) {
      pegman = new Pegman(id);
      this.addPegman(pegman);
    }
    return pegman;
  }

  getPegman(id) {
    // if id is null or undefined, set to default value.
    if(id == undefined) {
      id = DEFAULT_ID;
    }
    return this.pegmen[id];
  }
 
  addPegman(pegman) {
    if (this.pegmen[pegman.id]) {
      throw new Error(`Pegman with id ${pegman.id} already exists.`);
    }
    this.pegmen[pegman.id] = pegman;
  }

  isDefaultPegman(id) {
    return id == undefined || id === DEFAULT_ID;
  }
}
