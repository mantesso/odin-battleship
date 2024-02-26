const Ship = require("./ship");

class Gameboard {
  // default set of ships (lenght)
  static setOfShips = [4, 3, 3, 2, 2, 1, 1];

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

  isValidPosition(shipLength, coord, orientation, shipId = null) {
    if (orientation == "h") {
      if (coord[1] + shipLength > 10) return false;
      for (let i = 0; i < shipLength; i++) {
        let neighbors = this.getHorizontalNeighbors(i, shipLength);
        if (!this.checkNeighbors([coord[0], coord[1] + i], neighbors, shipId)) {
          return false;
        }
      }
    }

    if (orientation == "v") {
      if (coord[0] + shipLength > 10) return false;
      for (let i = 0; i < shipLength; i++) {
        let neighbors = this.getVerticalNeighbors(i, shipLength);
        if (!this.checkNeighbors([coord[0] + i, coord[1]], neighbors, shipId)) {
          return false;
        }
      }
    }

    return true;
  }

  rotateShip(shipLength, coord, orientation, shipId) {
    const newOrientation = orientation == "h" ? "v" : "h";

    if (this.isValidPosition(shipLength, coord, newOrientation, shipId)) {
      this.removeShip(shipLength, coord, orientation, shipId);
      this.placeShip(shipLength, coord, newOrientation);
      return true;
    } else {
      return false;
    }
  }

  placeShip(shipLength, coord, orientation) {
    if (!this.isValidPosition(shipLength, coord, orientation)) return false;
    const ship = new Ship(shipLength, orientation);

    for (let i = 0; i < shipLength; i++) {
      if (orientation == "h") {
        if (!this.shipsArray[coord[0]][coord[1] + i]) {
          this.markBufferZoneH(
            [coord[0], coord[1] + i],
            i,
            shipLength,
            ship.id
          );
          this.shipsArray[coord[0]][coord[1] + i] = ship;
        } else {
          return false;
        }
      } else if (orientation == "v") {
        if (!this.shipsArray[coord[0] + i][coord[1]]) {
          this.markBufferZoneV(
            [coord[0] + i, coord[1]],
            i,
            shipLength,
            ship.id
          );
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

  markBufferZoneH(coord, i, shipLength, shipId) {
    let neighbors = this.getHorizontalNeighbors(i, shipLength);
    this.distributeBuffer(coord, neighbors, shipId);
  }

  markBufferZoneV(coord, i, shipLength, shipId) {
    let neighbors = this.getVerticalNeighbors(i, shipLength);
    this.distributeBuffer(coord, neighbors, shipId);
  }

  distributeBuffer(coord, neighbors, shipId) {
    neighbors.forEach(([dy, dx]) => {
      const newY = coord[0] + dy;
      const newX = coord[1] + dx;

      // Check if the new coordinates are within grid bounds
      if (newY >= 0 && newY < 10 && newX >= 0 && newX < 10) {
        // Mark the cell as part of the buffer zone, if it's not already part of a ship
        let cell = this.shipsArray[newY][newX];
        if (cell == null) {
          this.shipsArray[newY][newX] = [shipId];
        } else if (Array.isArray(cell)) {
          this.shipsArray[newY][newX].push(shipId);
        }
      }
    });
  }

  // return true if all neighbors are null
  checkNeighbors(coord, neighbors, shipId = null) {
    for (let [dy, dx] of neighbors) {
      const newY = coord[0] + dy;
      const newX = coord[1] + dx;
      // no need to check out of board coords
      if (newY < 0 || newX < 0 || newY >= 10 || newX >= 10) continue;

      const cell = this.shipsArray[newY][newX];

      if (Array.isArray(cell) && cell.includes(shipId)) {
        continue; // Skip if it's the ship's own buffer
      }
      if (cell instanceof Ship) {
        if (cell.id == shipId) {
          continue; // no need to check where the ship being moved was previously placed
        } else {
          return false;
        }
      }
    }
    return true;
  }

  // clear neigbors by setting the cell to null
  clearNeighbors(coord, neighbors, shipId) {
    for (let i = 0; i < neighbors.length; i++) {
      const newY = coord[0] + neighbors[i][0];
      const newX = coord[1] + neighbors[i][1];

      // no need to clear "out of board" coordinates
      if (newY < 0 || newX < 0 || newY >= 10 || newX >= 10) continue;

      let cell = this.shipsArray[newY][newX];
      if (Array.isArray(cell)) {
        // Filter out the shipId from the buffer zone array
        this.shipsArray[newY][newX] = cell.filter((x) => x !== shipId);
        // After filtering, if the array is empty, set the cell to null
        if (this.shipsArray[newY][newX].length == 0) {
          this.shipsArray[newY][newX] = null;
        }
      }
    }
  }

  shuffledShipsArray() {
    return Gameboard.setOfShips.sort(() => Math.random() - 0.5);
  }

  placeRandomSetOfShips() {
    // clear the board first
    this.initializeShipsArray();

    // shuffle ships array
    const shuffledShips = this.shuffledShipsArray();
    // place ships with backtracking function
    if (!this.tryPlaceShips(shuffledShips, 0)) {
      console.error("Failed to place all ships.");
    }
  }

  tryPlaceShips(setOfShips, index) {
    if (index === setOfShips.length) return true; // successfully placed all ships

    let shipLength = setOfShips[index];
    let attempts = []; // avoid repeating attempts

    while (attempts.length < 100) {
      // Limit the number of attempts (usually it's possible to place everything with less than 10 attempts)
      let y = this.getRandomInt(10);
      let x = this.getRandomInt(10);
      let orientation = this.getRandomInt(2) === 0 ? "h" : "v";

      if (
        !attempts.find(
          (attempt) =>
            attempt.y === y &&
            attempt.x === x &&
            attempt.orientation === orientation
        )
      ) {
        attempts.push({ y, x, orientation });

        if (
          this.isValidPosition(shipLength, [y, x], orientation) &&
          this.placeShip(shipLength, [y, x], orientation)
        ) {
          if (this.tryPlaceShips(setOfShips, index + 1)) {
            return true;
          }
          this.removeShip(shipLength, [y, x], orientation);
        }
      }
    }

    console.error("failed to place ships randomly");
    return false;
  }

  removeShip(shipLength, coord, orientation, shipId = null) {
    for (let i = 0; i < shipLength; i++) {
      if (orientation == "h") {
        this.shipsArray[coord[0]][coord[1] + i] = null;
        let neighbors = this.getHorizontalNeighbors(i, shipLength);
        this.clearNeighbors([coord[0], coord[1] + i], neighbors, shipId);
      } else if (orientation == "v") {
        this.shipsArray[coord[0] + i][coord[1]] = null;
        let neighbors = this.getVerticalNeighbors(i, shipLength);
        this.clearNeighbors([coord[0] + i, coord[1]], neighbors, shipId);
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

  // returns true if all ships have sunk
  allSunk() {
    const ships = this.shipsArray.flat().filter((cell) => cell instanceof Ship);
    return ships.every((ship) => ship.isSunk());
  }
}

module.exports = Gameboard;
