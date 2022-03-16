const DOMController = require('./DOMController');
const Gameboard = require('./Gameboard');
const Player = require('./Player');

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