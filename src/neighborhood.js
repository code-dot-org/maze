const { SQUARE_SIZE, SVG_NS } = require("./drawer");
const Subtype = require("./subtype");

// World's worst React.createElement, but for SVG
function s(tag, props, parent) {
  const el = document.createElementNS(SVG_NS, tag);
  Object.keys(props).map(function (key) {
    el.setAttribute(key, props[key])
  });

  if (parent) {
    parent.appendChild(el);
  }

  return el;
}

// Path drawing a quarter circle
//    --+
//  /   |
//  +---+
function quarterCircle(size) {
  let hs = size/2;
  let cp = size/4;
  return `m${hs} ${hs}h-${hs}c0-${cp} ${cp}-${hs} ${hs}-${hs}z`;
}

// Path of the the slice of a square remaining once a quarter circle is 
// removed from it
// +----+
// | /
// + 
function cutout(size) {
  let hs = size / 2;
  let cp = size / 4;
  return `m0 0v${hs}c0-${cp} ${cp}-${hs} ${hs}-${hs}z`
}


// Path of the triangular corner
// +----+
// |  /
// | /
// +
function corner(size) {
  let hs = size / 2;
  return `m${hs} 0h-${hs}v${hs}z`
}

module.exports = class Neighborhood extends Subtype {

  resetTiles() {}

  // TODO: There is a way to get the value of a cell reliably but I couldn't
  // get it to work. This is a workaround method to simplify the logic below
  cellColor(row, col) {
    if (row >= this.maze_.map.ROWS) return "none";
    if (col >= this.maze_.map.COLS) return "none";
    return this.maze_.map.currentStaticGrid[row][col].originalValue_ || "none";
  }

  drawMapTiles(svg) {
    let qc = quarterCircle(SQUARE_SIZE);
    let c = cutout(SQUARE_SIZE);
    let co = corner(SQUARE_SIZE);
    
    let tileId = 0;
    for (let row = 0; row < this.maze_.map.ROWS; row++) {
      for (let col = 0; col < this.maze_.map.COLS; col++) {
        // Top left, top right, bottom left, bottom right
        let cells = [
          this.cellColor(row, col),
          this.cellColor(row+1, col),
          this.cellColor(row, col+1),
          this.cellColor(row+1,col+1)];
  
        // Create grid block group
        let g = s("g", {
            transform: `translate(${row * SQUARE_SIZE + SQUARE_SIZE/2}, 
              ${col * SQUARE_SIZE + SQUARE_SIZE/2})`
          }, svg);

        // Add a quarter circle to the top left corner of the block if there is 
        // a color value there
        if (cells[0] !== "none") {
          s("path", {d: qc, fill: cells[0], transform:"rotate(180)"}, g);
        }

        // Add a cutout shape if the top left corner has a color and one other
        // corner shares that color, filling in the top left quadrant of the block
        // completely
        if (cells[0] !== "none" && 
          (cells[0] == cells[1] || cells[0] == cells[2] || cells[0] == cells[3])) {
          s("path", {d: c, transform: "rotate(180)", fill: cells[0]}, g);

        // Otherwise, if the two adjacent corners have the same color, add the 
        // cutout shape with that color
        } else if (cells[0] == "none" && cells[1] !== "none" && cells[1] == cells[2]) {
          s("path", {d: c, transform: "rotate(180)", fill: cells[1]}, g);
        } else if (cells[0] !== "none" && cells[1] !== "none" && cells[2] !== "none" && cells[3] !== "none") {
          s("path", {d: c, transform: "rotate(180)", fill: cells[0]}, g);
        }

        // The rest of these statements follow the same pattern for each corner
        // of the block
        if (cells[1] && cells[1] !== "none") {
          s("path", {d: qc, fill: cells[1], transform: "rotate(-90)"}, g);
        }

        if (cells[1] !== "none" && 
          (cells[1] == cells[2] || cells[1] == cells[3] || cells[1] == cells[0])) {
          s("path", {d: c, transform: "rotate(-90)", fill: cells[1]}, g);
        } else if (cells[1] == "none" & cells[0] !== "none" && cells[0] == cells[3]) {
          s("path", {d: c, transform: "rotate(-90)", fill: cells[0]}, g);
        } else if (cells[1] !== "none" && cells[0] !== "none" && cells[2] !== "none" && cells[3] !== "none") {
          s("path", {d: c, transform: "rotate(-90)", fill: cells[1]}, g);
        }

        if (cells[2] && cells[2] !== "none") {  
          s("path", {d: qc, fill: cells[2], transform: "rotate(90)"}, g);
        }
        
        if (cells[2] !== "none" && 
          (cells[2] == cells[3] || cells[2] == cells[0] || cells[2] == cells[1])) {
          s("path", {d: c, transform: "rotate(90)", fill: cells[2]}, g);
        } else if (cells[2] == "none" && cells[0] !== "none" && cells[0] == cells[3]) {
          s("path", {d: c, transform: "rotate(90)", fill: cells[0]}, g);
        } else if (cells[2] !== "none" && cells[0] !== "none" && cells[1] !== "none" && cells[3] !== "none") {
          s("path", {d: c, transform: "rotate(90)", fill: cells[2]}, g);
        }

        if (cells[3] && cells[3] !== "none") {
          s("path", {d: qc, fill: cells[3]}, g);
        }

        if (cells[3] !== "none" && 
          (cells[3] == cells[0] || cells[3] == cells[1] || cells[3] == cells[2])) {
          s("path", {d: c, fill: cells[3]}, g);
        } else if (cells[3] == "none" && cells[1] !== "none" && cells[1] == cells[2]) {
          s("path", {d: c, fill: cells[1]}, g);
        } else if (cells[3] !== "none" && cells[0] !== "none" && cells[1] !== "none" && cells[2] !== "none") {
          s("path", {d: c,  fill: cells[3]}, g);
        }
      }
    }
  }
};