const { SQUARE_SIZE, SVG_NS } = require("./drawer");
const Subtype = require("./subtype");

const TILE_SHAPES = {
  "0000": [0, 3],
  "0001": [0, 0],
  "0010": [0, 1],
  "0011": [2, 1],
  "0100": [1, 0],
  "0101": [3, 2],
  "0110": [1, 2],
  "0111": [3, 0],
  "1000": [1, 1],
  "1001": [0, 2],
  "1010": [2, 2],
  "1011": [4, 0],
  "1100": [2, 0],
  "1101": [3, 1],
  "1110": [4, 1],
  "1111": [4, 2],
  obstacle: [1, 4],
};

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

function quarterCircle(size) {
  let hs = size/2;
  let cp = size/4;
  return `m${hs} ${hs}h-${hs}c0-${cp} ${cp}-${hs} ${hs}-${hs}z`;
}

function cutout(size) {
  let hs = size / 2;
  let cp = size / 4;
  return `m0 0v${hs}c0-${cp} ${cp}-${hs} ${hs}-${hs}z`
}

module.exports = class Neighborhood extends Subtype {
  computeAdjacency(row, col, color) {
    let result = "";
   /* if (this.getCell(row, col).hasValue() && this.getCell(row, col).getValue() === color) {
      result += "1";
    } else result += "0";

    if (this.getCell(row + 1, col).hasValue() && this.getCell(row + 1, col).getValue() === color) {
      result += "1";
    } else result += "0";

    if (this.getCell(row, col + 1).hasValue() && this.getCell(row, col + 1).getValue() === color) {
      result += "1";
    } else result += "0";

    if (this.getCell(row + 1, col + 1).hasValue() && this.getCell(row + 1, col + 1).getValue() === color) {
      result += "1";
    } else result += "0";*/

    return "1010";
  }

  drawTile(svg, tileSheetLocation, row, col, tileId, color = undefined) {
    const [left, top] = tileSheetLocation;

    const g = document.createElementNS(SVG_NS, "svg");
    g.setAttribute("x", (col-left) * SQUARE_SIZE);
    g.setAttribute("y", (row-top) * SQUARE_SIZE);
    g.setAttribute("width", SQUARE_SIZE);
    g.setAttribute("height", SQUARE_SIZE);
   // g.setAttribute("mask", "url(#mask)");
    svg.appendChild(g);

    const tileElement = document.createElementNS(SVG_NS, "rect");

    tileElement.setAttribute("x", left * SQUARE_SIZE);
    tileElement.setAttribute("y", top * SQUARE_SIZE);
    tileElement.setAttribute("fill", /*color*/ "green");
    tileElement.setAttribute("height", SQUARE_SIZE);
    tileElement.setAttribute("width", SQUARE_SIZE);
    g.appendChild(tileElement);
  }

  resetTiles() {

  }

  cellColor(row, col) {

    if (row >= this.maze_.map.ROWS) return "none";
    if (col >= this.maze_.map.COLS) return "none";

    return this.maze_.map.currentStaticGrid[row][col].originalValue_ || "none";
  }

  drawMapTiles(svg) {
    console.log(this);
    let qc = quarterCircle(SQUARE_SIZE);
    let c = cutout(SQUARE_SIZE);
    
    let tileId = 0;
    for (let row = 0; row < this.maze_.map.ROWS; row++) {
      for (let col = 0; col < this.maze_.map.COLS; col++) {
        let cells = [
          this.cellColor(row, col),
          this.cellColor(row+1, col),
          this.cellColor(row, col+1),
          this.cellColor(row+1,col+1)];
  
        let g = s("g", {
            transform: `translate(${row * SQUARE_SIZE + SQUARE_SIZE/2}, 
              ${col * SQUARE_SIZE + SQUARE_SIZE/2})`
          }, svg);

        if (cells[0] !== "none") {
          s("path", {d: qc, fill: cells[0], transform:"rotate(180)"}, g);
        }

        if (cells[0] !== "none" && 
          (cells[0] == cells[1] || cells[0] == cells[2] || cells[0] == cells[3])) {
          s("path", {d: c, transform: "rotate(180)", fill: cells[0]}, g);
        } else if(cells[1] !== "none" && cells[1] == cells[2]) {
          s("path", {d: c, transform: "rotate(180)", fill: cells[1]}, g);
        }

        if (cells[1] && cells[1] !== "none") {
          s("path", {d: qc, fill: cells[1], transform: "rotate(-90)"}, g);
        }

        if (cells[1] !== "none" && 
          (cells[1] == cells[2] || cells[1] == cells[3] || cells[1] == cells[0])) {
          s("path", {d: c, transform: "rotate(-90)", fill: cells[1]}, g);
        } else if(cells[0] !== "none" && cells[0] == cells[3]) {
          s("path", {d: c, transform: "rotate(-90)", fill: cells[0]}, g);
        }

        if (cells[2] && cells[2] !== "none") {  
          s("path", {d: qc, fill: cells[2], transform: "rotate(90)"}, g);
        }
        
        if (cells[2] !== "none" && 
          (cells[2] == cells[3] || cells[2] == cells[0] || cells[2] == cells[1])) {
          s("path", {d: c, transform: "rotate(90)", fill: cells[2]}, g);
        } else if(cells[0] !== "none" && cells[0] == cells[3]) {
          s("path", {d: c, transform: "rotate(90)", fill: cells[0]}, g);
        }

        if (cells[3] && cells[3] !== "none") {
          s("path", {d: qc, fill: cells[3]}, g);
        }
        if (cells[3] !== "none" && 
          (cells[3] == cells[0] || cells[3] == cells[1] || cells[3] == cells[2])) {
          s("path", {d: c, fill: cells[3]}, g);
        } else if(cells[1] !== "none" && cells[1] == cells[2]) {
          s("path", {d: c, fill: cells[1]}, g);
        }
      }
    }
  }
};
