class Ship {
  static idCount = 0;
  constructor(length, orientation) {
    this.id = ++this.constructor.idCount;
    this.length = length;
    this.hits = 0;
    this.orientation = orientation;
  }

  hit() {
    this.hits += 1;
    console.log("Ship hitted");
  }

  isSunk() {
    return this.hits >= this.length;
  }
}

module.exports = Ship;
