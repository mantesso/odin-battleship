const Ship = require("./ship");

class Gameboard {
  constructor() {
    this.shipsArray = [];
    this.initializeshipsArray();

    this.missedShots = [];
    this.successShots = [];
  }

  initializeshipsArray() {
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
    console.log(block);
    if (block) {
      block.hit();
      this.successShots.push(coord);
    } else {
      this.missedShots.push(coord);
    }
  }

  allSunk() {
    return this.shipsArray
      .flat()
      .filter((n) => n)
      .every((block) => {
        if (block.isSunk()) {
          return true;
        }
      });
  }
}

module.exports = Gameboard;

// let gameboard = new Gameboard();
// // console.log(gameboard.initializeGameboard());
// console.log(gameboard.placeShip(1, [0, 0], "v"));
// console.log(gameboard.receiveAttack([0, 0]));
// // console.log(gameboard.shipsArray);
// console.log(gameboard.allSunk());
