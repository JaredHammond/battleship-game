const Ship = require('./Ship');

const Gameboard = () => {
  const board = Array(10).fill().map(() => Array(10).fill().map(() => {
    return {
      isHit: false,
      ship: null
    }
  }))

  const ships = [Ship(5), Ship(4), Ship(3), Ship(3), Ship(2)]
  let nextShipForPlacement = 0 // Index of next ship to be placed in ships array

  const getBoard = () => {
    return board;
  }

  const placeShip = (ship, direction, coord) => {
    if (!isShipPlacementValid(ship, direction, coord)) {return false}

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

    return true
  }

  const placeNextShip = (direction, coord) => {
    if (placeShip(ships[nextShipForPlacement], direction, coord)) {
      nextShipForPlacement++
    }
  }

  const isShipPlacementValid = (ship, direction, coord) => {
    let [row, column] = coord;
    const shipLength = ship.getLength();

    // Check for ships already placed
    if (direction === "horizontal") {
      for (let i=0; i < shipLength; i++) {
        if (board[row]?.[column + i]?.ship !== null) {
          return false
        }
      }
    }

    if (direction === "vertical") {
      for (let i=0; i < shipLength; i++) {
        if (board[row + i]?.[column]?.ship !== null) {
          return false
        }
      }
    }


    // Check if ship would go off the board
    if (direction === "horizontal") {
      if (shipLength + column > 10) {
        return false
      }
    }

    if (direction === "vertical") {
      if (shipLength + row > 10) {
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

  const allShipsSunk = () => {
    for (let ship of ships) {
      if (!ship.isSunk()) {
        return false
      }
    }
    return true
  }

  let placementAxis = 'horizontal';

  const getAxis = () => placementAxis;

  const swapAxis = () => {
    if (placementAxis === 'horizontal') {
      placementAxis = 'vertical';
    } else {
      placementAxis = 'horizontal';
    }
  }

  const isPlacementHoverValid = () => {
    
  }


  return {
    getBoard,
    placeShip,
    isShipPlacementValid,
    receiveAttack,
    getShips,
    allShipsSunk,
    placeNextShip,
    getAxis,
    swapAxis,
  }
}



module.exports = Gameboard