/**
 * @overview single point of entry for requiring all Subtype subclasses
 */
const Farmer = require('./farmer');
const Bee = require('./bee');
const Collector = require('./collector');
const Wordsearch = require('./wordsearch');
const Harvester = require('./harvester');
const Planter = require('./planter');

module.exports = {
  Farmer,
  Bee,
  Collector,
  Wordsearch,
  Harvester,
  Planter,
}

