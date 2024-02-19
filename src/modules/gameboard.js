const Ship = require("./ship");

class Gameboard {
  // default set of ships (lenght)
  static setOfShips = [1, 4, 3, 3, 2, 2, 2, 1, 1, 1];

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

  isValidPosition(shipLength, coord, orientation) {
    if (orientation == "h") {
      if (coord[1] + shipLength > 10) return false;
      for (let i = 0; i < shipLength; i++) {
        let neighbors = this.getHorizontalNeighbors(i, shipLength);
        if (!this.checkNeighbors([coord[0], coord[1] + i], neighbors)) {
          return false;
        }
      }
    }

    if (orientation == "v") {
      if (coord[0] + shipLength > 10) return false;
      for (let i = 0; i < shipLength; i++) {
        let neighbors = this.getVerticalNeighbors(i, shipLength);
        if (!this.checkNeighbors([coord[0] + i, coord[1]], neighbors)) {
          return false;
        }
      }
    }

    return true;
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

  getHorizontalNeighbors(i, shipLength) {
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

    return neighbors;
  }

  getVerticalNeighbors(i, shipLength) {
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
    return neighbors;
  }

  markBufferZoneH(coord, i, shipLength) {
    let neighbors = this.getHorizontalNeighbors(i, shipLength);
    this.distributeBuffer(coord, neighbors);
  }

  markBufferZoneV(coord, i, shipLength) {
    let neighbors = this.getVerticalNeighbors(i, shipLength);
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
          this.shipsArray[newX][newY] = 1;
        }
      }
    });
  }

  // return true if all neighbors are null
  checkNeighbors(coord, neighbors) {
    for (let i = 0; i < neighbors.length; i++) {
      const newX = coord[0] + neighbors[i][0];
      const newY = coord[1] + neighbors[i][1];

      // no need to check "out of board" coordinates
      if (newX < 0 || newY < 0 || newX >= 10 || newY >= 10) {
        continue;
      }

      if (this.shipsArray[newX][newY] !== null) {
        return false;
      }
    }

    return true;
  }

  // clear neigbors by setting the cell to null
  clearNeighbors(coord, neighbors) {
    for (let i = 0; i < neighbors.length; i++) {
      const newX = coord[0] + neighbors[i][0];
      const newY = coord[1] + neighbors[i][1];

      // no need to check "out of board" coordinates
      if (newX < 0 || newY < 0 || newX >= 10 || newY >= 10) {
        continue;
      }

      this.shipsArray[newX][newY] = null;
    }
  }

  placeRandomSetOfShips() {
    // place first ship randomly
    let coord = [this.getRandomInt(4), this.getRandomInt(4)];
    let orientation = this.getRandomInt(2) == 0 ? "h" : "v";
    let shipLength = Gameboard.setOfShips[0];
    this.placeShip(shipLength, coord, orientation);

    if (!this.tryPlaceShips(Gameboard.setOfShips, 1)) {
      console.log("Failed to place all ships.");
    }
  }

  tryPlaceShips(setOfShips, index) {
    if (index >= setOfShips.length - 1) {
      // -1 because first ship was placed randomly by placeRandomSetOfShips(
      return true; // Base case: all ships have been placed successfully
    }

    let shipLength = setOfShips[index];
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        for (let orientation of ["h", "v"]) {
          if (
            this.isValidPosition(shipLength, [y, x], orientation) &&
            this.placeShip(shipLength, [y, x], orientation)
          ) {
            if (this.tryPlaceShips(setOfShips, index + 1)) {
              return true; // Successful recursive placement
            }
            // Undo the current ship placement if the recursive placement failed
            this.removeShip(shipLength, [y, x], orientation);
          }
        }
      }
    }
    return false; // No valid placement was found for this ship
  }

  removeShip(shipLength, coord, orientation) {
    for (let i = 0; i < shipLength; i++) {
      if (orientation === "h") {
        this.shipsArray[coord[0]][coord[1] + i] = null;
        let neighbors = this.getHorizontalNeighbors(i, shipLength);
        this.clearNeighbors([coord[0], coord[1] + i], neighbors);
      } else {
        // orientation === 'v'
        this.shipsArray[coord[0] + i][coord[1]] = null;
        let neighbors = this.getVerticalNeighbors(i, shipLength);
        this.clearNeighbors([coord[0] + i, coord[1]], neighbors);
      }
    }
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
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
    const ships = this.shipsArray.flat().filter((cell) => cell instanceof Ship);
    return ships.every((ship) => ship.isSunk());
  }
}

module.exports = Gameboard;

// let gameboard = new Gameboard();
// gameboard.placeShip(3, [1, 1], "v");

// console.log(gameboard.isValidPosition(1, [2, 2], "h"));
// gameboard.placeRandomSetOfShips();

// console.log(gameboard.placeShip(3, [1, 1], "h"));
// console.log(gameboard.placeShip(3, [1, 1], "v"));
// console.log(gameboard.receiveAttack([0, 0]));
// console.table(gameboard.shipsArray);

// gameboard.removeShip(3, [1, 1], "v");
// console.log(gameboard.allSunk());
// console.table(gameboard.shipsArray);
