const MazeController = require('../src/mazeController');
const sampleConfig = require('./sampleConfig');
const SVG_NS = require('../src/constants').SVG_NS;

// Set up HTML enviroment
const container = document.createElement('div');
document.body.appendChild(container);
const svg = document.createElementNS(SVG_NS, 'svg');
container.appendChild(svg);
const look = document.createElementNS(SVG_NS, 'g');
look.id = "look";
svg.appendChild(look);

// initialize controller
const controller = window.mazeController = new MazeController(sampleConfig.level, sampleConfig.skin, sampleConfig);
controller.map.resetDirt();
controller.subtype.initStartFinish();
controller.subtype.createDrawer(svg);
controller.subtype.initWallMap();
container.style.width = controller.MAZE_WIDTH + 'px';
controller.initWithSvg(svg);
controller.reset(true);
