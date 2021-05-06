/**
 * @overview single point of entry for requiring all Subtype subclasses
 */
const Farmer = require('./farmer');
const Bee = require('./bee');
const Collector = require('./collector');
const Wordsearch = require('./wordsearch');
const Harvester = require('./harvester');
const Planter = require('./planter');
const Neighborhood = require('./neighborhood');

module.exports = {
  Farmer,
  Bee,
  Collector,
  Wordsearch,
  Harvester,
  Planter,
  Neighborhood
}

