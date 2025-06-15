import MazeController from './MazeController';
import MazeMap from './MazeMap';
import * as drawMap from './drawMap';
import * as tiles from './tiles';
import * as utils from './utils';

import Cell from './Cell';
import BeeCell from './BeeCell';
import HarvesterCell from './HarvesterCell';
import PlanterCell from './PlanterCell';
import NeighborhoodCell from './NeighborhoodCell';

const cells = {
  Cell,
  BeeCell,
  HarvesterCell,
  PlanterCell,
  NeighborhoodCell,
};

import Bee from './Bee';
import Collector from './Collector';
import Farmer from './Farmer';
import Harvester from './Harvester';
import Neighborhood from './Neighborhood';
import Planter from './Planter';
import WordSearch from './WordSearch';

const subtypes = {
  Farmer,
  Bee,
  Collector,
  WordSearch,
  Harvester,
  Planter,
  Neighborhood,
  // For some reason, this was renamed for export in the old version
  // So it is included here like this for compatibility
  Wordsearch: WordSearch,
};

export {
  MazeController,
  MazeMap,
  cells,
  drawMap,
  subtypes,
  tiles,
  utils,
}
