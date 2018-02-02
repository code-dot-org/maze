import Maze from './maze';
import sampleConfig from './sampleConfig';

const container = document.createElement('div');
container.id = 'container';
document.body.appendChild(container);

const maze = window.maze = new Maze()

maze.init(sampleConfig);

maze.render('container');
maze.animatedMove(0, 1000);
