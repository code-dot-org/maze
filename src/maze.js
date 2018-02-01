export default class Maze {

  /**
   * Schedule to add dirt at pegman's current position.
   */
  scheduleFill() {
    this.scheduleDirtChange({
      amount: 1,
      sound: 'fill'
    });
  }
  
  /**
   * Schedule to remove dirt at pegman's current location.
   */
  scheduleDig() {
    this.scheduleDirtChange({
      amount: -1,
      sound: 'dig'
    });
  }

  scheduleDirtChange(options) {
    var col = this.pegmanX;
    var row = this.pegmanY;
  
    // cells that started as "flat" will be undefined
    var previousValue = this.map.getValue(row, col) || 0;
  
    this.map.setValue(row, col, previousValue + options.amount);
    this.subtype.scheduleDirtChange(row, col);
    // TODO
    //studioApp().playAudio(options.sound);
  }
}
