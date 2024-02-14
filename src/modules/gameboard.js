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

    for (let i = 0; i < shipLength; i++) {
      if (orientation == "h") {
        if (!this.shipsArray[coord[0]][coord[1] + i]) {
          this.markBufferZoneH([coord[0], coord[1] + i], i, shipLength);
          this.shipsArray[coord[0]][coord[1] + i] = ship;
        } else {
          return false;
        }
      } else if (orientation == "v") {
        if (!this.shipsArray[coord[0] + i][coord[1]]) {
          this.markBufferZoneV([coord[0] + i, coord[1]], i, shipLength);
          this.shipsArray[coord[0] + i][coord[1]] = ship;
        } else {
          return false;
        }
      }
    }
    return true;
  }

  markBufferZoneH(coord, i, shipLength) {
    let neighbors;
    if (shipLength == 1) {
      neighbors = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];
    } else if (i == 0) {
      neighbors = [
        [-1, -1],
        [-1, 0],
        [0, -1],
        [1, -1],
        [1, 0],
      ];
    } else if (i == shipLength - 1) {
      neighbors = [
        [-1, 0],
        [-1, 1],
        [0, 1],
        [1, 0],
        [1, 1],
      ];
    } else if (i > 0 && i < shipLength) {
      neighbors = [
        [-1, 0],
        [1, 0],
      ];
    }

    this.distributeBuffer(coord, neighbors);
  }

  markBufferZoneV(coord, i, shipLength) {
    let neighbors;
    if (shipLength == 1) {
      neighbors = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];
    } else if (i == 0) {
      neighbors = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
      ];
    } else if (i == shipLength - 1) {
      neighbors = [
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];
    } else if (i > 0 && i < shipLength) {
      neighbors = [
        [0, -1],
        [0, 1],
      ];
    }
    this.distributeBuffer(coord, neighbors);
  }

  distributeBuffer(coord, neighbors) {
    neighbors.forEach(([dx, dy]) => {
      const newX = coord[0] + dx;
      const newY = coord[1] + dy;

      // Check if the new coordinates are within grid bounds
      if (
        newX >= 0 &&
        newX < this.shipsArray.length &&
        newY >= 0 &&
        newY < this.shipsArray[newX].length
      ) {
        // Mark the cell as part of the buffer zone, if it's not already part of a ship
        if (this.shipsArray[newX][newY] === null) {
          this.shipsArray[newX][newY] = 1; // Use a distinctive marker for buffer zones
        }
      }
    });
  }

  receiveAttack(coord) {
    let block = this.shipsArray[coord[0]][coord[1]];
    if (block instanceof Ship) {
      block.hit();
      this.successShots.push(coord);
      return true;
    } else {
      this.missedShots.push(coord);
      return false;
    }
  }

  allSunk() {
    return this.shipsArray
      .flat()
      .filter((n) => {
        n instanceof Ship ? true : false;
      })
      .every((block) => {
        if (block.isSunk()) {
          return true;
        }
      });
  }
}

module.exports = Gameboard;

// let gameboard = new Gameboard();

// console.log(gameboard.placeShip(3, [1, 1], "h"));
// console.log(gameboard.placeShip(3, [1, 1], "v"));
// console.log(gameboard.receiveAttack([0, 0]));
// console.table(gameboard.shipsArray);
// console.log(gameboard.allSunk());
