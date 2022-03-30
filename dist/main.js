/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/ComputerLogic.js":
/*!**************************************!*\
  !*** ./src/modules/ComputerLogic.js ***!
  \**************************************/
/***/ ((module) => {

function ComputerLogic(oppBoard, prevMoves = []) {
  const boardState = oppBoard.getBoard();

  function bestMove() {
    for (let move of prevMoves) {
      // Find most recent ship hit and go from there
      if (boardState[move].ship && !boardState[move].ship.isSunk()) {
        // Search for two hits in a row and keep going in that axis
        let nextMove = continueAttackingInRow(move);
        if (nextMove !== null) {
          prevMoves.unshift(nextMove);
          return nextMove;
        }

        // If it can't go in the same direction, it tries the other direction
        nextMove = attackTheOppositeWay(move);
        if (nextMove !== null) {
          prevMoves.unshift(nextMove);
          return nextMove;
        }

        // Couldn't find another hit square, so hit any adjacent square
        nextMove = attackAnyAdjacentSquare(move);
        if (nextMove !== null) {
          prevMoves.unshift(nextMove);
          return nextMove;
        }
      }
    }

    return optimizedRandomMove();
  }

  function attackTheOppositeWay(initialSquare) {
    for (let i = 0; i < 4; i++) {
      let s = adjacentSquare(initialSquare, i);
      if (s === null) {
        continue;
      }

      if (boardState[s].ship && boardState[s].isHit) {
        while (boardState[s].isHit) {
          s = adjacentSquare(s, i);
          if (s === null) {
            break;
          }
        }
        if (s === null) {
          continue;
        }

        if (!boardState[s].isHit) {
          return s;
        }
      }
    }
    return null;
  }

  function continueAttackingInRow(initialSquare) {
    for (let i = 0; i < 4; i++) {
      let s = adjacentSquare(initialSquare, i);
      if (s === null) {
        continue;
      }

      if (boardState[s].ship && boardState[s].isHit) {
        let nextMove = oppositeAdjacentSquare(initialSquare, i);
        if (nextMove === null) {
          continue;
        }

        if (!boardState[nextMove].isHit) {
          return nextMove;
        }
      }
    }
    return null;
  }

  function attackAnyAdjacentSquare(initialSquare) {
    // Hit non-hit squares around the initial square
    for (let i = 0; i <= 3; i++) {
      let move = adjacentSquare(initialSquare, i);

      if (move === null) {
        continue;
      }

      if (!boardState[move].isHit) {
        return move;
      }
    }

    return null;
  }

  // Accepts a square and a direction which can be a string or a number.
  // Numbers correspond to direction in this order => 0:'up', 1:'right', 2:'down', 3:'left'
  function adjacentSquare(square, direction) {
    switch (direction) {
      case "up":
      case 0:
        return square - 10 >= 0 ? square - 10 : null;

      case "right":
      case 1:
        if (square % 10 > (square + 1) % 10 || square === 99) {
          return null;
        }
        return square + 1;

      case "down":
      case 2:
        return square + 10 <= 99 ? square + 10 : null;

      case "left":
      case 3:
        if (square % 10 < (square - 1) % 10 || square === 0) {
          return null;
        }
        return square - 1;
    }
  }

  function oppositeAdjacentSquare(square, direction) {
    switch (direction) {
      case "up":
      case 0:
        return adjacentSquare(square, 2);

      case "right":
      case 1:
        return adjacentSquare(square, 3);

      case "down":
      case 2:
        return adjacentSquare(square, 0);

      case "left":
      case 3:
        return adjacentSquare(square, 1);
    }
  }

  function optimizedRandomMove() {
    // Only pick tiles in a checkerboard pattern. (Ships must intersect)

    let tensPlace = Math.floor(Math.random() * 10);
    let move;

    // Even rows should have even ones place. Odd rows have odd ones place.
    if (tensPlace % 2 === 0) {
      move = tensPlace * 10 + Math.floor(Math.random() * 5) * 2;
    } else {
      move = tensPlace * 10 + (Math.floor(Math.random() * 5) * 2 + 1);
    }

    while (prevMoves.includes(move)) {
      tensPlace = Math.floor(Math.random() * 10);

      // Even rows should have even ones place. Odd rows have odd ones place.
      if (tensPlace % 2 === 0) {
        move = tensPlace * 10 + Math.floor(Math.random() * 5) * 2;
      } else {
        move = tensPlace * 10 + (Math.floor(Math.random() * 5) * 2 + 1);
      }
    }

    prevMoves.unshift(move);

    return move;
  }

  function randomMove() {
    let move = Math.floor(Math.random() * 100);

    while (prevMoves.includes(move)) {
      move = Math.floor(Math.random() * 100);
    }

    prevMoves.unshift(move);
    return move;
  }

  return {
    randomMove,
    optimizedRandomMove,
    bestMove,
  };
}

module.exports = ComputerLogic;


/***/ }),

/***/ "./src/modules/DOMController.js":
/*!**************************************!*\
  !*** ./src/modules/DOMController.js ***!
  \**************************************/
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
    const instruction = document.createElement('h2');
    instruction.innerHTML = 'Place your ships';
    instruction.id = 'instruction'
    gameArea.appendChild(instruction);

    const axisButton = document.createElement('button');
    axisButton.id = 'axisButton'
    axisButton.innerHTML = 'Swap Ship Axis';
    axisButton.addEventListener('click', axisHandler)

    gameArea.appendChild(axisButton);

    let squares = Array.from(playerDomBoard.children)

    squares.forEach(square => {
      square.addEventListener('mouseenter', hoverHandler)
      square.addEventListener('click', clickHandler);
    })

    playerDomBoard.addEventListener('mouseleave', handleMouseLeaveBoard)

    gameArea.appendChild(playerDomBoard);
  }

  function handleMouseLeaveBoard() {
    let playerSquares = Array.from(playerDomBoard.children);
    let compSquares = Array.from(compDomBoard.children);

    playerSquares.map(square => {
      square.classList.remove('valid', 'invalid');
    });

    compSquares.map(square => {
      square.classList.remove('battleHover');
    })
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
      square.classList.remove('valid', 'invalid', 'battleHover', 'hit', 'sunk', 'shipHit', 'ship');

      // Add ship locations to player board
      if (domBoard === playerDomBoard) {
        if (gameBoard[squareId].ship) {
          square.classList.add('ship');
        }
      }

      // Checks for hit
      if (gameBoard[squareId].isHit) {
        square.classList.add('hit');
      }

      // Checks for sunk boat
      if (gameBoard[squareId].ship?.isSunk()) {
        square.classList.add('sunk');
      }

      // If ship is hit add effect
      if (gameBoard[squareId].ship && gameBoard[squareId].isHit) {
        square.classList.add('shipHit');
        square.classList.remove('hit')
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
    document.getElementById('axisButton').remove();
    const squares = Array.from(playerDomBoard.children);

    squares.map(square => {
      square.removeEventListener('mouseenter', hoverHandler);
      square.removeEventListener('click', clickHandler);
    })
  }

  function renderBattlePhase() {
    playerDomBoard.classList.add('left');
    compDomBoard.classList.add('right');


    gameArea.appendChild(compDomBoard);
  }

  function renderBattleHover(square, gameboard) {
    let allSquares = Array.from(compDomBoard.children);

    allSquares.map(element => {
      element.classList.remove('battleHover');
    })

    if (gameboard[square.dataset.squareId].isHit) {
      return
    }

    square.classList.add('battleHover');
  }

  function setupPlayerTurn(handleBattleHover, handleBattleClick) {
    const instruction = document.getElementById('instruction');
    instruction.innerHTML = "Attack your opponent\'s board"

    const compSquares = Array.from(compDomBoard.children);

    compSquares.map(square => {
      square.addEventListener('mouseenter', handleBattleHover);
      square.addEventListener('click', handleBattleClick);
    })

    compDomBoard.addEventListener('mouseleave', handleMouseLeaveBoard);
  }

  function setupComputerTurn(handleBattleHover, handleBattleClick) {
    let squares = Array.from(compDomBoard.children);

    squares.map(square => {
      square.removeEventListener('mouseenter', handleBattleHover);
      square.removeEventListener('click', handleBattleClick);
    })
  }

  function renderEndGame(winner, handlePlayAgain) {
    let endModal = document.createElement('div');
    endModal.id = 'endModal';

    const winnerText = document.createElement('h2');
    winnerText.innerHTML = `${winner} won the game!`
    endModal.appendChild(winnerText);

    const playAgainText = document.createElement('p');
    playAgainText.innerHTML = 'Would you like to play again?';
    endModal.appendChild(playAgainText);

    const playAgainButton = document.createElement('button');
    playAgainButton.innerHTML = 'Play Again';
    playAgainButton.onclick = handlePlayAgain;
    endModal.appendChild(playAgainButton);

    gameArea.appendChild(endModal);
  }

  function cleanUpEndGame(playerBoard, compBoard) {
    while(gameArea.firstChild) {
      gameArea.removeChild(gameArea.firstChild);
    }

    playerDomBoard.classList.remove('left');
    compDomBoard.classList.remove('right');

    refreshBoards(playerBoard, compBoard);
  }

  return {
    renderPlacementPhase,
    renderPlacementHoverStatus,
    refreshBoards,
    cleanUpPlacementPhase,
    renderBattlePhase,
    renderBattleHover,
    setupComputerTurn,
    setupPlayerTurn,
    renderEndGame,
    cleanUpEndGame
  }
}

module.exports = DOMController


/***/ }),

/***/ "./src/modules/GameController.js":
/*!***************************************!*\
  !*** ./src/modules/GameController.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const DOMController = __webpack_require__(/*! ./DOMController */ "./src/modules/DOMController.js");
const Gameboard = __webpack_require__(/*! ./Gameboard */ "./src/modules/Gameboard.js");
const Player = __webpack_require__(/*! ./Player */ "./src/modules/Player.js");

function GameController() {
  const dom = DOMController();

  let playerBoard = Gameboard();
  let computer = Player(playerBoard);
  let compBoard = Gameboard();

  function startGame() {
    dom.renderPlacementPhase(
      playerBoard.swapAxis,
      shipPlacementHandler,
      shipPlacementHoverHandler
    );
  }

  function startBattlePhase() {
    compBoard.randomShipPlacement();

    dom.renderBattlePhase();
    dom.setupPlayerTurn(handleBattleHover, handleBattleClick);
  }

  // During placement phase, determines whether ship placement would be valid, then renders that state
  function shipPlacementHoverHandler(e) {
    // Identifier for square user is hovering over
    const squareId = Number(e.target.dataset.squareId);

    const { isValid, shipLocation } =
      playerBoard.isPlacementHoverValid(squareId);

    // Render hover state to DOM
    dom.renderPlacementHoverStatus(isValid, shipLocation);
  }

  function shipPlacementHandler(e) {
    const squareId = Number(e.target.dataset.squareId);

    const isSuccessful = playerBoard.placeNextShip(squareId);

    if (isSuccessful) {
      dom.refreshBoards(playerBoard, compBoard);
      if (playerBoard.isPlacementFinished()) {
        dom.cleanUpPlacementPhase(
          shipPlacementHandler,
          shipPlacementHoverHandler
        );

        startBattlePhase(handleBattleHover, handleBattleClick);
      }
    }
  }

  function handleBattleHover(e) {
    const square = e.target;

    // Add hover state
    dom.renderBattleHover(square, compBoard.getBoard());
  }

  // During battle phase, controls what happens when player clicks square on opponent board
  function handleBattleClick(e) {
    const squareId = e.target.dataset.squareId;

    // Do attack. If it returns true, hit was successful, refresh boards and setup for computer turn
    if (compBoard.receiveAttack(squareId)) {
      e.target.removeEventListener("click", handleBattleClick);
      dom.refreshBoards(playerBoard, compBoard);

      // Check for win
      if (compBoard.allShipsSunk()) {
        endGame("player");
        return;
      }

      dom.setupComputerTurn(handleBattleHover, handleBattleClick);
      computerTurn();
    }
  }

  function computerTurn() {
    // Attack player board
    playerBoard.receiveAttack(computer.makeMove());
    dom.refreshBoards(playerBoard, compBoard);

    // Check for win
    if (playerBoard.allShipsSunk()) {
      endGame("computer");
      return;
    }

    dom.setupPlayerTurn(handleBattleHover, handleBattleClick);
  }

  function endGame(winner) {
    const winnerText = winner === "player" ? "You" : "The Computer";

    dom.setupComputerTurn(handleBattleHover, handleBattleClick); // Removes event listeners for hover and click on the board

    dom.renderEndGame(winnerText, handlePlayAgain);
  }

  function handlePlayAgain() {

    playerBoard = Gameboard();
    computer = Player(playerBoard);
    compBoard = Gameboard();

    dom.cleanUpEndGame(playerBoard, compBoard);

    startGame();
  }

  return {
    startGame,
  };
}

module.exports = GameController;


/***/ }),

/***/ "./src/modules/Gameboard.js":
/*!**********************************!*\
  !*** ./src/modules/Gameboard.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Ship = __webpack_require__(/*! ./Ship */ "./src/modules/Ship.js");

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

/***/ }),

/***/ "./src/modules/Player.js":
/*!*******************************!*\
  !*** ./src/modules/Player.js ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const ComputerLogic = __webpack_require__(/*! ./ComputerLogic */ "./src/modules/ComputerLogic.js");

const Player = (oppBoard) => {
  const comp = ComputerLogic(oppBoard);

  function makeMove() {
    return comp.bestMove();
  }

  return {
    makeMove,
  };
};

module.exports = Player;


/***/ }),

/***/ "./src/modules/Ship.js":
/*!*****************************!*\
  !*** ./src/modules/Ship.js ***!
  \*****************************/
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
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const GameController = __webpack_require__(/*! ./modules/GameController.js */ "./src/modules/GameController.js");

game = GameController()

game.startGame()
})();

/******/ })()
;