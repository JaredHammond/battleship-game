const Ship = require('./shipFactory');

const Gameboard = () => {
  const board = Array(10).fill().map(() => Array(10).fill().map(() => {
    return {
      isHit: false,
      ship: null
    }
  }))

  const ships = [Ship(5), Ship(4), Ship(3), Ship(3), Ship(2)]

  const getBoard = () => {
    return board;
  }

  const placeShip = (ship, direction, coord) => {
    if (!isShipPlacementValid(ship, direction, coord)) {return}

    let [row, column] = coord;
    const shipLength = ship.getLength();

    if (direction === "horizontal") {
      for (let i=0; i < shipLength; i++) {
        board[row][column].ship = ship;
        column++
      }
    }

    if (direction === "vertical") {
      for (let i=0; i < shipLength; i++) {
        board[row][column].ship = ship;
        row++
      }
    }
  }

  const isShipPlacementValid = (ship, direction, coord) => {
    let [row, column] = coord;
    const shipLength = ship.getLength();

    // Check for ships already placed
    if (direction === "horizontal") {
      for (let i=0; i < shipLength; i++) {
        if (board[row][column + i].ship !== null) {
          return false
        }
      }
    }

    if (direction === "vertical") {
      for (let i=0; i < shipLength; i++) {
        if (board[row + i][column].ship !== null) {
          return false
        }
      }
    }


    // Check if ship would go off the board
    if (direction === "horizontal") {
      if (shipLength + row > 10) {
        return false
      }
    }

    if (direction === "vertical") {
      if (shipLength + column > 10) {
        return false
      }
    }


    // If nothing is invalid, then return true
    return true;
  }

  const receiveAttack = (row, col) => {
    const square = board[row][col];

    square.isHit = true;

    if (square.ship !== null) {
      square.ship.hit();
    }
  }

  const getShips = () => {
    return ships;
  }


  return {
    getBoard,
    placeShip,
    isShipPlacementValid,
    receiveAttack,
    getShips,
  }
}



module.exports = Gameboard