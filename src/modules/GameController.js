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
  
  function startBattlePhase() {
    compBoard.randomShipPlacement();

    dom.renderBattlePhase()
    dom.setupPlayerTurn(handleBattleHover, handleBattleClick);
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

        startBattlePhase(handleBattleHover, handleBattleClick);
      }
    }
  }

  function handleBattleHover(e) {
    const square = e.target

    // Add hover state
    dom.renderBattleHover(square, compBoard.getBoard());
  }

  // During battle phase, controls what happens when player clicks square on opponent board
  function handleBattleClick(e) {
    const squareId = e.target.dataset.squareId;

    // Do attack. If it returns true, hit was successful, refresh boards and setup for computer turn
    if (compBoard.receiveAttack(squareId)) {
      e.target.removeEventListener('click', handleBattleClick);
      dom.refreshBoards(playerBoard, compBoard);

      // Check for win
      if (compBoard.allShipsSunk()) {
        endGame('player')
        return
      }

      dom.setupComputerTurn(handleBattleHover, handleBattleClick);
      computerTurn()
    }
  }

  function computerTurn() {
    // Attack player board
    playerBoard.receiveAttack(computer.makeMove())
    dom.refreshBoards(playerBoard, compBoard);

    // Check for win
    if (playerBoard.allShipsSunk()) {
      endGame('computer');
      return
    }

    dom.setupPlayerTurn(handleBattleHover, handleBattleClick);
  }

  function endGame(winner) {
    const winnerText = winner === 'player' ? 'You' : 'The Computer';

    dom.setupComputerTurn(); // Removes event listeners for hover and click on the board
    
    dom.renderEndGame(winnerText);
  }



  return {
    startGame
  }
}

module.exports = GameController;