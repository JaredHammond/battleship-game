/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const GameController = __webpack_require__(/*! ./modules/GameController.js */ \"./src/modules/GameController.js\");\n\ngame = GameController()\n\ngame.startGame()\n\n//# sourceURL=webpack://battleship-redo/./src/index.js?");

/***/ }),

/***/ "./src/modules/DOMController.js":
/*!**************************************!*\
  !*** ./src/modules/DOMController.js ***!
  \**************************************/
/***/ ((module) => {

eval("const DOMController = () => {\n\n  // Creates a set of dom nodes that represents the gameboard\n  function domBoard(playerName) {\n    const board = document.createElement('div');\n    board.id = playerName;\n    board.classList.add('board')\n\n    for (let i = 0; i < 100; i++) {\n      let square = document.createElement('div');\n      square.classList.add('square');\n      square.dataset.squareId = i;\n      board.appendChild(square);\n    }\n\n    return board;\n  }\n\n  \n  const playerDomBoard = domBoard('player');\n  const compDomBoard = domBoard('comp');\n\n  // Base DOM node that the game attaches to\n  const gameArea = document.getElementById('game-area');\n  \n  // Renders a single gameboard for the player to place their ships\n  function renderPlacementPhase(axisHandler, clickHandler, hoverHandler) {\n    const axisButton = document.createElement('button');\n    axisButton.id = 'axisButton'\n    axisButton.innerHTML = 'Swap Ship Axis';\n    axisButton.addEventListener('click', axisHandler)\n\n    gameArea.appendChild(axisButton);\n\n    let squares = Array.from(playerDomBoard.children)\n\n    squares.forEach(square => {\n      square.addEventListener('mouseenter', hoverHandler)\n      square.addEventListener('click', clickHandler);\n    })\n\n    playerDomBoard.addEventListener('mouseleave', handleMouseLeaveBoard)\n\n    gameArea.appendChild(playerDomBoard);\n  }\n\n  function handleMouseLeaveBoard() {\n    let playerSquares = Array.from(playerDomBoard.children);\n    let compSquares = Array.from(compDomBoard.children);\n\n    playerSquares.map(square => {\n      square.classList.remove('valid', 'invalid');\n    });\n\n    compSquares.map(square => {\n      square.classList.remove('battleHover');\n    })\n  }\n\n  function refreshBoards(playerBoard, compBoard) {\n    refreshBoard(playerBoard, playerDomBoard);\n    refreshBoard(compBoard, compDomBoard);\n  }\n\n  function refreshBoard(board, domBoard) {\n    const squares = Array.from(domBoard.children);\n    const gameBoard = board.getBoard();\n\n    \n    squares.map(square => {\n      const squareId = Number(square.dataset.squareId);\n\n      // Remove hover state\n      square.classList.remove('valid', 'invalid', 'battleHover');\n\n      // Add ship locations to player board\n      if (domBoard === playerDomBoard) {\n        if (gameBoard[squareId].ship) {\n          square.classList.add('ship');\n        }\n      }\n\n      // Checks for hit\n      if (gameBoard[squareId].isHit) {\n        square.classList.add('hit');\n      }\n\n      // Checks for sunk boat\n      if (gameBoard[squareId].ship?.isSunk()) {\n        square.classList.add('sunk');\n      }\n\n      // If ship is hit add effect\n      if (gameBoard[squareId].ship && gameBoard[squareId].isHit) {\n        square.classList.add('shipHit');\n        square.classList.remove('hit')\n      }\n      \n    });\n  }\n  \n  function renderPlacementHoverStatus (isValid, shipLocation) {\n    let squares = Array.from(playerDomBoard.children);\n\n    squares.map(square => {\n      square.classList.remove('valid', 'invalid');\n    })\n\n    if (isValid) {\n      squares.map(square => {\n        if (shipLocation.includes(Number(square.dataset.squareId))) {\n          square.classList.add('valid');\n        }\n      })\n    } else {\n      squares.map(square => {\n        if (shipLocation.includes(Number(square.dataset.squareId))) {\n          square.classList.add('invalid');\n        }\n      })\n    }\n  }\n\n  function cleanUpPlacementPhase(clickHandler, hoverHandler) {\n    document.getElementById('axisButton').remove();\n    const squares = Array.from(playerDomBoard.children);\n\n    squares.map(square => {\n      square.removeEventListener('mouseenter', hoverHandler);\n      square.removeEventListener('click', clickHandler);\n    })\n  }\n\n  function renderBattlePhase() {\n\n    playerDomBoard.classList.add('left');\n    compDomBoard.classList.add('right')\n\n    gameArea.appendChild(compDomBoard);\n  }\n\n  function renderBattleHover(square, gameboard) {\n    let allSquares = Array.from(compDomBoard.children);\n\n    allSquares.map(element => {\n      element.classList.remove('battleHover');\n    })\n\n    if (gameboard[square.dataset.squareId].isHit) {\n      return\n    }\n\n    square.classList.add('battleHover');\n  }\n\n  function setupPlayerTurn(handleBattleHover, handleBattleClick) {\n    const compSquares = Array.from(compDomBoard.children);\n\n    compSquares.map(square => {\n      square.addEventListener('mouseenter', handleBattleHover);\n      square.addEventListener('click', handleBattleClick);\n    })\n\n    compDomBoard.addEventListener('mouseleave', handleMouseLeaveBoard);\n  }\n\n  function setupComputerTurn(handleBattleHover, handleBattleClick) {\n    let squares = Array.from(compDomBoard.children);\n\n    squares.map(square => {\n      square.removeEventListener('mouseenter', handleBattleHover);\n      square.removeEventListener('click', handleBattleClick);\n    })\n  }\n\n  return {\n    renderPlacementPhase,\n    renderPlacementHoverStatus,\n    refreshBoards,\n    cleanUpPlacementPhase,\n    renderBattlePhase,\n    renderBattleHover,\n    setupComputerTurn,\n    setupPlayerTurn,\n  }\n}\n\nmodule.exports = DOMController\n\n\n//# sourceURL=webpack://battleship-redo/./src/modules/DOMController.js?");

/***/ }),

/***/ "./src/modules/GameController.js":
/*!***************************************!*\
  !*** ./src/modules/GameController.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const DOMController = __webpack_require__(/*! ./DOMController */ \"./src/modules/DOMController.js\");\nconst Gameboard = __webpack_require__(/*! ./Gameboard */ \"./src/modules/Gameboard.js\");\nconst Player = __webpack_require__(/*! ./Player */ \"./src/modules/Player.js\");\n\nfunction GameController() {\n  const dom = DOMController();\n\n  const playerBoard = Gameboard();\n  const computer = Player();\n  const compBoard = Gameboard();\n\n  function startGame() {\n    dom.renderPlacementPhase(playerBoard.swapAxis, shipPlacementHandler, shipPlacementHoverHandler);\n  }\n  \n  function startBattlePhase() {\n    compBoard.randomShipPlacement();\n\n    dom.renderBattlePhase()\n    dom.setupPlayerTurn(handleBattleHover, handleBattleClick);\n  }\n  \n  // During placement phase, determines whether ship placement would be valid, then renders that state\n  function shipPlacementHoverHandler (e) {\n    // Identifier for square user is hovering over\n    const squareId = Number(e.target.dataset.squareId);\n    \n    const {isValid, shipLocation} = playerBoard.isPlacementHoverValid(squareId);\n  \n    // Render hover state to DOM\n    dom.renderPlacementHoverStatus(isValid, shipLocation);\n  }\n  \n  function shipPlacementHandler(e) {\n    const squareId = Number(e.target.dataset.squareId);\n  \n    const isSuccessful = playerBoard.placeNextShip(squareId);\n  \n    if (isSuccessful) {\n      dom.refreshBoards(playerBoard, compBoard);\n      if (playerBoard.isPlacementFinished()) {\n        dom.cleanUpPlacementPhase(shipPlacementHandler, shipPlacementHoverHandler);\n\n        startBattlePhase(handleBattleHover, handleBattleClick);\n      }\n    }\n  }\n\n  function handleBattleHover(e) {\n    const square = e.target\n\n    // Add hover state\n    dom.renderBattleHover(square, compBoard.getBoard());\n  }\n\n  // During battle phase, controls what happens when player clicks square on opponent board\n  function handleBattleClick(e) {\n    const squareId = e.target.dataset.squareId;\n\n    // Do attack. If it returns true, hit was successful, refresh boards and setup for computer turn\n    if (compBoard.receiveAttack(squareId)) {\n      e.target.removeEventListener('click', handleBattleClick);\n      dom.refreshBoards(playerBoard, compBoard);\n\n      // Check for win\n      if (compBoard.allShipsSunk()) {\n        endGame()\n        return\n      }\n\n      dom.setupComputerTurn(handleBattleHover, handleBattleClick);\n      computerTurn()\n    }\n  }\n\n  function computerTurn() {\n    // Attack player board\n    playerBoard.receiveAttack(computer.makeMove())\n    dom.refreshBoards(playerBoard, compBoard);\n\n    // Check for win\n    if (playerBoard.allShipsSunk()) {\n      endGame();\n      return\n    }\n\n    dom.setupPlayerTurn(handleBattleHover, handleBattleClick);\n  }\n\n  function endGame() {\n    //TODO\n    alert('Someone won');\n  }\n\n\n\n  return {\n    startGame\n  }\n}\n\nmodule.exports = GameController;\n\n//# sourceURL=webpack://battleship-redo/./src/modules/GameController.js?");

/***/ }),

/***/ "./src/modules/Gameboard.js":
/*!**********************************!*\
  !*** ./src/modules/Gameboard.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Ship = __webpack_require__(/*! ./Ship */ \"./src/modules/Ship.js\");\n\nconst Gameboard = () => {\n  const board = Array(100).fill().map(() => {\n    return {\n      isHit: false,\n      ship: null\n    }\n  });\n\n  const ships = [Ship(5), Ship(4), Ship(3), Ship(3), Ship(2)]\n  let nextShipForPlacement = 0 // Index of next ship to be placed in ships array\n\n  const getBoard = () => {\n    return board;\n  }\n\n  const placeShip = (ship, direction, square) => {\n\n    if (!isShipPlacementValid(ship, direction, square).isValid) {return false}\n\n    const shipLength = ship.getLength();\n\n    if (direction === \"horizontal\") {\n      for (let i=0; i < shipLength; i++) {\n        board[square + i].ship = ship;\n      }\n    }\n\n    if (direction === \"vertical\") {\n      for (let i=0; i < shipLength; i++) {\n        board[square + i*10].ship = ship;\n      }\n    }\n\n    return true\n  }\n\n  // Tries to place the next ship. If successful, increments to the next ship\n  const placeNextShip = (square) => {\n    let result = placeShip(ships[nextShipForPlacement], placementAxis, square)\n    if (result) {\n      nextShipForPlacement++\n    }\n    return result;\n  }\n\n  function isPlacementFinished() {\n    if (!ships[nextShipForPlacement]) {\n      return true\n    }\n    return false;\n  }\n\n  const isShipPlacementValid = (ship, direction, square) => {\n    const shipLength = ship.getLength();\n    let isValid = true\n\n    // Check for ships already placed\n    if (direction === \"horizontal\") {\n      for (let i=0; i < shipLength; i++) {\n        if (board[square + i]?.ship !== null) {\n          isValid = false\n        }\n      }\n    }\n\n    if (direction === \"vertical\") {\n      for (let i=0; i < shipLength; i++) {\n        if (board[square + i*10]?.ship !== null) {\n          isValid = false\n        }\n      }\n    }\n\n\n    // Check if ship would go off the board\n    if (direction === \"horizontal\") {\n\n      if (shipLength + square % 10 > 10) {\n        isValid = false\n      }\n    }\n\n    if (direction === \"vertical\") {\n      if (shipLength + Math.floor(square / 10) > 10) {\n        isValid = false\n      }\n    }\n\n    const shipLocation = populateShipLocation(ship, direction, square)\n\n    // If nothing is invalid, then return true\n    return {\n      isValid,\n      shipLocation\n    };\n  }\n\n  const populateShipLocation = (ship, direction, move) => {\n    let location = [];\n    const shipLength = ship.getLength()\n\n    if (direction === 'horizontal') {\n      for(let i=0; i<shipLength; i++) {\n        if (move%10 + i > 9) {\n          break\n        }\n\n        location.push(move + i);\n      }\n    } else if (direction === 'vertical') {\n      for(let i=0; i<shipLength; i++) {\n        if (Math.floor(move / 10) + i > 9) {\n          break\n        }\n\n        location.push(move + i * 10);\n      }\n    }\n    return location\n  }\n\n  const receiveAttack = (move) => {\n    const square = board[move];\n\n    if (square.isHit) {return false};\n\n    square.isHit = true;\n\n    if (square.ship !== null) {\n      square.ship.hit();\n    }\n    return true\n  }\n\n  const getShips = () => {\n    return ships;\n  }\n\n  const allShipsSunk = () => {\n    for (let ship of ships) {\n      if (!ship.isSunk()) {\n        return false\n      }\n    }\n    return true\n  }\n\n  let placementAxis = 'horizontal';\n\n  const getAxis = () => placementAxis;\n\n  const swapAxis = () => {\n    if (placementAxis === 'horizontal') {\n      placementAxis = 'vertical';\n    } else {\n      placementAxis = 'horizontal';\n    }\n  }\n\n  const isPlacementHoverValid = (squareId) => {\n    return isShipPlacementValid(ships[nextShipForPlacement], placementAxis, squareId);\n  }\n\n  function randomShipPlacement() {\n    while (nextShipForPlacement < ships.length) {\n\n      // Randomly swap axis\n      if (Math.floor(Math.random() * 2) % 2 === 0) {\n        swapAxis();\n      }\n\n      // Pick random square for placement\n      let move = Math.floor(Math.random() * 100)\n\n      // Attempt to place ship\n      placeNextShip(move)\n    }\n  }\n\n\n  return {\n    getBoard,\n    placeShip,\n    isShipPlacementValid,\n    receiveAttack,\n    getShips,\n    allShipsSunk,\n    placeNextShip,\n    getAxis,\n    swapAxis,\n    isPlacementHoverValid,\n    isPlacementFinished,\n    randomShipPlacement,\n  }\n}\n\n\n\nmodule.exports = Gameboard\n\n//# sourceURL=webpack://battleship-redo/./src/modules/Gameboard.js?");

/***/ }),

/***/ "./src/modules/Player.js":
/*!*******************************!*\
  !*** ./src/modules/Player.js ***!
  \*******************************/
/***/ ((module) => {

eval("const Player = () => {\n  const prevMoves = Array(100).fill().map(() => null)\n\n  const makeMove = () => {\n    let move = Math.floor(Math.random() * 100);\n\n    while (prevMoves[move] !== null) {\n      move = Math.floor(Math.random() * 100);\n    }\n\n    prevMoves[move] = 'hit';\n\n    return move\n  }\n\n  return {\n    makeMove,\n  }\n}\n\nmodule.exports = Player;\n\n//# sourceURL=webpack://battleship-redo/./src/modules/Player.js?");

/***/ }),

/***/ "./src/modules/Ship.js":
/*!*****************************!*\
  !*** ./src/modules/Ship.js ***!
  \*****************************/
/***/ ((module) => {

eval("const Ship = (length) => {\n  let hitCount = 0\n\n  const isSunk = () => {\n    if (hitCount < length) {\n      return false;\n    } else {\n      return true;\n    }\n  }\n\n  const hit = () => {\n    hitCount += 1\n  }\n\n  const getLength = () => {\n    return length;\n  }\n\n  return {\n    isSunk,\n    hit,\n    getLength\n  }\n}\n\nmodule.exports = Ship;\n\n//# sourceURL=webpack://battleship-redo/./src/modules/Ship.js?");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;