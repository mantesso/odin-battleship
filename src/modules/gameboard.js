const Ship = require("./ship");

class Gameboard {
  constructor() {
    this.shipsArray = [];
    this.missedShots = [];
    this.successShots = [];
  }

  initializeGameboard() {
    for (let y = 0; y < 10; y++) {
      this.shipsArray[y] = [];
      for (let x = 0; x < 10; x++) {
        this.shipsArray[y][x] = null;
      }
    }
  }

  placeShip(shipLength, coord, orientation) {
    const ship = new Ship(shipLength);

    for (let i = 0; i < ship.length; i++) {
      if (orientation == "h") {
        this.shipsArray[coord[0]][coord[1] + i] = ship;
      } else if (orientation == "v") {
        this.shipsArray[coord[0] + i][coord[1]] = ship;
      }
    }
  }

  receiveAttack(coord) {
    let block = this.shipsArray[coord[0]][coord[1]];
  }
  allSunk() {
    return false;
  }
}

let gameboard = new Gameboard();
console.log(gameboard.initializeGameboard());
console.log(gameboard.placeShip(4, [1, 7], "v"));
console.log(gameboard.shipsArray);
