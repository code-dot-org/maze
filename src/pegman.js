module.exports = class Pegman {
  constructor(id, x = null, y = null, direction = null, isVisible = true) {
    if (id == null) {
      throw new Error('Pegman id cannot be null or undefined');
    }
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.id = id;
    this.isVisible = isVisible;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getDirection() {
    return this.direction;
  }
  
  getId() {
    return this.id;
  }

  getIsVisible() {
    return this.isVisible;
  }

  setX(x) {
    this.x = x;
  }

  setY(y) {
    this.y = y;
  }

  setDirection(direction) {
    this.direction = direction;
  }

  setIsVisible(isVisible) {
    this.isVisible = isVisible;
  }
}
