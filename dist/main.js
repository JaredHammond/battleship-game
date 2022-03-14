/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 654:
/***/ ((module) => {

const DOMController = () => {

  const domBoard = (playerName) => {
    const board = document.createElement('div');
    board.id = playerName;
    board.classList.add('board')

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        let square = document.createElement('div');
        square.classList.add('square');
        square.dataset.row = i;
        square.dataset.col = j;
        board.appendChild(square);
      }
    }

    return board;
  }

  const playerDomBoard = domBoard('player');
  const compDomBoard = domBoard('comp');
  const gameArea = document.getElementById('game-area');
  

  const renderPlacementPhase = (playerBoard) => {
    console.log(playerDomBoard)
    let squares = Array.from(playerDomBoard.children)

    squares.forEach(square => {
      square.addEventListener('mouseover', e => shipPlacementHover(e, playerBoard))
      square.addEventListener('click', e => shipPlacement(e, playerBoard));
    })

    gameArea.appendChild(playerDomBoard);
  }
  
  const shipPlacementHover = (e, playerBoard) => {
    const {row, col} = e.target.dataset
    
    let shipCoords = playerBoard.isPlacementHoverValid([row, col]);
  }

  return {
    renderPlacementPhase,
    shipPlacementHover,
  }
}

module.exports = DOMController


/***/ }),

/***/ 112:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Ship = __webpack_require__(547);

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

/***/ }),

/***/ 758:
/***/ ((module) => {

const Player = () => {
  const prevMoves = Array(10).fill().map(() => Array(10).fill().map(() => null))

  const makeMove = () => {
    let row = Math.floor(Math.random() * 10);
    let col = Math.floor(Math.random() * 10);

    while (prevMoves[row][col] !== null) {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
    }

    prevMoves[row][col] = 'hit';

    return [row, col]
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
const DOMController = __webpack_require__(654);
const Gameboard = __webpack_require__(112);
const Player = __webpack_require__(758);

const dom = DOMController()
const playerBoard = Gameboard();
const opponent = Player();
const oppBoard = Gameboard();

dom.renderPlacementPhase(playerBoard);
})();

/******/ })()
;