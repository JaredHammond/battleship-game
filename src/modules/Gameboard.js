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

    if (!isShipPlacementValid(ship, direction, square).isValid) {return false}

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

  // Tries to place the next ship. If successful, increments to the next ship
  const placeNextShip = (square) => {
    let result = placeShip(ships[nextShipForPlacement], placementAxis, square)
    if (result) {
      nextShipForPlacement++
    }
    return result;
  }

  function isPlacementFinished() {
    if (!ships[nextShipForPlacement]) {
      return true
    }
    return false;
  }

  const isShipPlacementValid = (ship, direction, square) => {
    const shipLength = ship.getLength();
    let isValid = true

    // Check for ships already placed
    if (direction === "horizontal") {
      for (let i=0; i < shipLength; i++) {
        if (board[square + i]?.ship !== null) {
          isValid = false
        }
      }
    }

    if (direction === "vertical") {
      for (let i=0; i < shipLength; i++) {
        if (board[square + i*10]?.ship !== null) {
          isValid = false
        }
      }
    }


    // Check if ship would go off the board
    if (direction === "horizontal") {

      if (shipLength + square % 10 > 10) {
        isValid = false
      }
    }

    if (direction === "vertical") {
      if (shipLength + Math.floor(square / 10) > 10) {
        isValid = false
      }
    }

    const shipLocation = populateShipLocation(ship, direction, square)

    // If nothing is invalid, then return true
    return {
      isValid,
      shipLocation
    };
  }

  const populateShipLocation = (ship, direction, move) => {
    let location = [];
    const shipLength = ship.getLength()

    if (direction === 'horizontal') {
      for(let i=0; i<shipLength; i++) {
        if (move%10 + i > 9) {
          break
        }

        location.push(move + i);
      }
    } else if (direction === 'vertical') {
      for(let i=0; i<shipLength; i++) {
        if (Math.floor(move / 10) + i > 9) {
          break
        }

        location.push(move + i * 10);
      }
    }
    return location
  }

  const receiveAttack = (move) => {
    const square = board[move];

    if (square.isHit) {return false};

    square.isHit = true;

    if (square.ship !== null) {
      square.ship.hit();
    }
    return true
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

  const isPlacementHoverValid = (squareId) => {
    return isShipPlacementValid(ships[nextShipForPlacement], placementAxis, squareId);
  }

  function randomShipPlacement() {
    while (nextShipForPlacement < ships.length) {

      // Randomly swap axis
      if (Math.floor(Math.random() * 2) % 2 === 0) {
        swapAxis();
      }

      // Pick random square for placement
      let move = Math.floor(Math.random() * 100)

      // Attempt to place ship
      placeNextShip(move)
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
    isPlacementHoverValid,
    isPlacementFinished,
    randomShipPlacement,
  }
}



module.exports = Gameboard