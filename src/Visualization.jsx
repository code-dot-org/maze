import React from 'react';
import PropTypes from 'prop-types';

export default class Visualization extends React.Component {
  static propTypes = {
    onMount: PropTypes.func
  }

  componentDidMount() {
    this.props.onMount();
  }

  render() {
    return (
      <svg version="1.1" id="svgMaze">
        <g id="look">
          <path d="M 0,-15 a 15 15 0 0 1 15 15" />
          <path d="M 0,-35 a 35 35 0 0 1 35 35" />
          <path d="M 0,-55 a 55 55 0 0 1 55 55" />
        </g>
      </svg>
    );
  }
}
