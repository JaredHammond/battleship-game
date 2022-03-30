const DOMController = require("./DOMController");
const Gameboard = require("./Gameboard");
const Player = require("./Player");

function GameController() {
  const dom = DOMController();

  let playerBoard = Gameboard();
  let computer = Player(playerBoard);
  let compBoard = Gameboard();

  let turn = "player";

  function changeTurn() {
    if (turn === "player") {
      turn = "computer";
    } else {
      turn = "player";
    }
  };

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

    if (turn === "computer") {
      return;
    }

    // Do attack. If it returns true, hit was successful, refresh boards and setup for computer turn
    if (compBoard.receiveAttack(squareId)) {
      e.target.removeEventListener("click", handleBattleClick);
      dom.refreshBoards(playerBoard, compBoard);

      // Check for win
      if (compBoard.allShipsSunk()) {
        endGame("player");
        return;
      }

      changeTurn();
      dom.setupComputerTurn();
      computerTurn();
    }
  }

  async function computerTurn() {
    await dom.animateComputerLogic(playerBoard);

    // Attack player board
    playerBoard.receiveAttack(computer.makeMove());
    dom.refreshBoards(playerBoard, compBoard);

    // Check for win
    if (playerBoard.allShipsSunk()) {
      endGame("computer");
      return;
    }

    // dom.setupPlayerTurn(handleBattleHover, handleBattleClick);
    changeTurn();
    console.log('becoming player turn');
  }

  function endGame(winner) {
    const winnerText = winner === "player" ? "You" : "The Computer";

    // dom.setupComputerTurn(handleBattleHover, handleBattleClick); // Removes event listeners for hover and click on the board

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
