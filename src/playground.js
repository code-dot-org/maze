import React from 'react';
import ReactDOM from 'react-dom';

import Maze from './maze';
import sampleConfig from './sampleConfig';

const container = document.createElement('div');
container.id = 'container';
document.body.appendChild(container);

class Playground extends React.Component {
  constructor() {
    super();
    this.maze = window.maze = new Maze()
    this.maze.init(sampleConfig);
  }

  componentDidMount() {
    this.maze.render('viz');
  }

  /* eslint-disable react/jsx-no-bind */
  render() {
    return (
      <div>
        <div id="viz" />
        <button onClick={this.maze.animatedMove.bind(this.maze, 0, 400)}>Move North</button>
        <button onClick={this.maze.animatedMove.bind(this.maze, 1, 400)}>Move East</button>
        <button onClick={this.maze.animatedMove.bind(this.maze, 2, 400)}>Move South</button>
        <button onClick={this.maze.animatedMove.bind(this.maze, 3, 400)}>Move West</button>
        <button onClick={this.maze.animatedTurn.bind(this.maze, -1)}>Turn Left</button>
        <button onClick={this.maze.animatedTurn.bind(this.maze, 1)}>Turn Right</button>
      </div>
    );
  }
  /* eslint-enable react/jsx-no-bind */
}

ReactDOM.render(
  <Playground />,
  document.getElementById('container')
);
