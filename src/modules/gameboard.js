const Ship = require("./ship");

class Gameboard {
  constructor() {
    this.shipsArray = [];
    this.initializeShipsArray();

    this.missedShots = [];
    this.successShots = [];
  }

  initializeShipsArray() {
    for (let y = 0; y < 10; y++) {
      this.shipsArray[y] = [];
      for (let x = 0; x < 10; x++) {
        this.shipsArray[y][x] = null;
      }
    }
  }

  placeShip(shipLength, coord, orientation) {
    if (orientation === "h" && coord[1] + shipLength > 10) {
      return false; // Out of bounds horizontally
    }
    if (orientation === "v" && coord[0] + shipLength > 10) {
      return false; // Out of bounds vertically
    }

    const ship = new Ship(shipLength);

    for (let i = 0; i < ship.length; i++) {
      if (orientation == "h") {
        if (!this.shipsArray[coord[0]][coord[1] + i]) {
          this.shipsArray[coord[0]][coord[1] + i] = ship;
        } else {
          return false;
        }
      } else if (orientation == "v") {
        if (!this.shipsArray[coord[0] + i][coord[1]]) {
          this.shipsArray[coord[0] + i][coord[1]] = ship;
        } else {
          return false;
        }
      }
    }
    return true;
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

let arr = [1, 2, 3];
arr[4] = "aaa";
console.log(arr);
