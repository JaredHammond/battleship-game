/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 654:
/***/ ((module) => {

const DOMController = () => {

  // Creates a set of dom nodes that represents the gameboard
  function domBoard(playerName) {
    const board = document.createElement('div');
    board.id = playerName;
    board.classList.add('board')

    for (let i = 0; i < 100; i++) {
      let square = document.createElement('div');
      square.classList.add('square');
      square.dataset.squareId = i;
      board.appendChild(square);
    }

    return board;
  }

  
  const playerDomBoard = domBoard('player');
  const compDomBoard = domBoard('comp');

  // Base DOM node that the game attaches to
  const gameArea = document.getElementById('game-area');
  
  // Renders a single gameboard for the player to place their ships
  function renderPlacementPhase(axisHandler, clickHandler, hoverHandler) {
    const axisButton = document.createElement('button');
    axisButton.innerHTML = 'Swap Ship Axis';
    axisButton.addEventListener('click', axisHandler)

    gameArea.appendChild(axisButton);

    let squares = Array.from(playerDomBoard.children)

    squares.forEach(square => {
      square.addEventListener('mouseenter', hoverHandler)
      square.addEventListener('click', clickHandler);
    })

    gameArea.appendChild(playerDomBoard);
  }

  function refreshBoards(playerBoard, compBoard) {
    refreshBoard(playerBoard, playerDomBoard);
    refreshBoard(compBoard, compDomBoard);
  }

  function refreshBoard(board, domBoard) {
    const squares = Array.from(domBoard.children);
    const gameBoard = board.getBoard();

    
    squares.map(square => {
      const squareId = Number(square.dataset.squareId);

      // Remove hover state
      square.classList.remove('valid', 'invalid', 'hover');

      // Add ship locations
      if (gameBoard[squareId].ship) {
        square.classList.add('ship');
      }

      // Checks for hit
      if (gameBoard[squareId].isHit) {
        square.classList.add('hit');
      }

      // Checks for sunk boat
      if (gameBoard[squareId].ship?.isSunk()) {
        square.classList.add('sunk');
      }
      
    });
  }
  
  function renderPlacementHoverStatus (isValid, shipLocation) {
    let squares = Array.from(playerDomBoard.children);

    squares.map(square => {
      square.classList.remove('valid', 'invalid');
    })

    if (isValid) {
      squares.map(square => {
        if (shipLocation.includes(Number(square.dataset.squareId))) {
          square.classList.add('valid');
        }
      })
    } else {
      squares.map(square => {
        if (shipLocation.includes(Number(square.dataset.squareId))) {
          square.classList.add('invalid');
        }
      })
    }
  }

  function cleanUpPlacementPhase(clickHandler, hoverHandler) {
    const squares = Array.from(playerDomBoard.children);

    squares.map(square => {
      square.removeEventListener('mouseenter', hoverHandler);
      square.removeEventListener('click', clickHandler);
    })
  }

  return {
    renderPlacementPhase,
    renderPlacementHoverStatus,
    refreshBoards,
    cleanUpPlacementPhase,
  }
}

module.exports = DOMController


/***/ }),

/***/ 846:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const DOMController = __webpack_require__(654);
const Gameboard = __webpack_require__(112);
const Player = __webpack_require__(758);

function GameController() {
  const dom = DOMController();

  const playerBoard = Gameboard();
  const computer = Player();
  const compBoard = Gameboard();

  function startGame() {
    dom.renderPlacementPhase(playerBoard.swapAxis, shipPlacementHandler, shipPlacementHoverHandler);
  }
  
  
  // During placement phase, determines whether ship placement would be valid, then renders that state
  function shipPlacementHoverHandler (e) {
    // Identifier for square user is hovering over
    const squareId = Number(e.target.dataset.squareId);
    
    const {isValid, shipLocation} = playerBoard.isPlacementHoverValid(squareId);
  
    // Render hover state to DOM
    dom.renderPlacementHoverStatus(isValid, shipLocation);
  }
  
  function shipPlacementHandler(e) {
    const squareId = Number(e.target.dataset.squareId);
  
    const isSuccessful = playerBoard.placeNextShip(squareId);
  
    if (isSuccessful) {
      dom.refreshBoards(playerBoard, compBoard);
      if (playerBoard.isPlacementFinished()) {
        dom.cleanUpPlacementPhase(shipPlacementHandler, shipPlacementHoverHandler);
      }
    }
  }

  return {
    startGame
  }
}

module.exports = GameController;

/***/ }),

/***/ 112:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Ship = __webpack_require__(547);

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

  const isPlacementHoverValid = (squareId) => {
    return isShipPlacementValid(ships[nextShipForPlacement], placementAxis, squareId);
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
  }
}



module.exports = Gameboard

/***/ }),

/***/ 758:
/***/ ((module) => {

const Player = () => {
  const prevMoves = Array(100).fill().map(() => null)

  const makeMove = () => {
    let move = Math.floor(Math.random() * 100);

    while (prevMoves[move] !== null) {
      move = Math.floor(Math.random() * 100);
    }

    prevMoves[move] = 'hit';

    return move
  }

  return {
    makeMove,
  }
}

module.exports = Player;

/***/ }),

/***/ 547:
/***/ ((module) => {

const Ship = (length) => {
  let hitCount = 0

  const isSunk = () => {
    if (hitCount < length) {
      return false;
    } else {
      return true;
    }
  }

  const hit = () => {
    hitCount += 1
  }

  const getLength = () => {
    return length;
  }

  return {
    isSunk,
    hit,
    getLength
  }
}

module.exports = Ship;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const GameController = __webpack_require__(846);

game = GameController()

game.startGame()
})();

/******/ })()
;