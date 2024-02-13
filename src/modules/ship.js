class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
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
