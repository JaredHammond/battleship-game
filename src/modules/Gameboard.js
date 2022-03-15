const Ship = require('./Ship');

const Gameboard = () => {
  const board = Array(100).fill().map(() => {
    return {
      isHit: false,
      ship: null
    }
  });

  const ships = [Ship(5), Ship(4), Ship(3), Ship(3), Ship(2)]
  let nextShipForPlacement = 0 // Index of next ship to be placed in ships array

  const getBoard = () => {
    return board;
  }

  const placeShip = (ship, direction, square) => {
    if (!isShipPlacementValid(ship, direction, square)) {return false}

    const shipLength = ship.getLength();

    if (direction === "horizontal") {
      for (let i=0; i < shipLength; i++) {
        board[square + i].ship = ship;
      }
    }

    if (direction === "vertical") {
      for (let i=0; i < shipLength; i++) {
        board[square + i*10].ship = ship;
      }
    }

    return true
  }

  const placeNextShip = (direction, square) => {
    if (placeShip(ships[nextShipForPlacement], direction, square)) {
      nextShipForPlacement++
    }
  }

  const isShipPlacementValid = (ship, direction, square) => {
    const shipLength = ship.getLength();

    // Check for ships already placed
    if (direction === "horizontal") {
      for (let i=0; i < shipLength; i++) {
        if (board[square + i]?.ship !== null) {
          return false
        }
      }
    }

    if (direction === "vertical") {
      for (let i=0; i < shipLength; i++) {
        if (board[square + i*10]?.ship !== null) {
          return false
        }
      }
    }


    // Check if ship would go off the board
    if (direction === "horizontal") {

      if (shipLength + square % 10 > 10) {
        return false
      }
    }

    if (direction === "vertical") {
      if (shipLength + Math.floor(square / 10) > 10) {
        return false
      }
    }


    // If nothing is invalid, then return true
    return true;
  }

  const receiveAttack = (move) => {
    const square = board[move];

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

  const isPlacementHoverValid = (move) => {
    const isValid = isShipPlacementValid(nextShipForPlacement, placementAxis, move)

    let shipCoords = [];

    if (placementAxis === 'horizontal') {
      for (let i=0; i < nextShipForPlacement.getLength(); i++) {
        if (i + col > 9) {break};
        shipCoords.push([row, i + col])
      }
    } else {
      for (let i=0; i < nextShipForPlacement.getLength(); i++) {
        if (i + row > 9) {break};
        shipCoords.push([row + i, col])
      }
    }

    return {
      isValid,
      shipCoords
    }
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
    isPlacementHoverValid
  }
}



module.exports = Gameboard