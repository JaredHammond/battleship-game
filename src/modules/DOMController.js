const DOMController = () => {
  // Creates a set of dom nodes that represents the gameboard
  function domBoard(playerName) {
    const board = document.createElement("div");
    board.id = playerName;
    board.classList.add("board");

    for (let i = 0; i < 100; i++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.dataset.squareId = i;
      board.appendChild(square);
    }

    return board;
  }

  const playerDomBoard = domBoard("player");
  const compDomBoard = domBoard("comp");

  // Base DOM node that the game attaches to
  const gameArea = document.getElementById("game-area");

  // Renders a single gameboard for the player to place their ships
  function renderPlacementPhase(axisHandler, clickHandler, hoverHandler) {
    const instruction = document.createElement("h2");
    instruction.innerHTML = "Place your ships";
    instruction.id = "instruction";
    gameArea.appendChild(instruction);

    const axisButton = document.createElement("button");
    axisButton.id = "axisButton";
    axisButton.innerHTML = "Swap Ship Axis";
    axisButton.addEventListener("click", axisHandler);

    gameArea.appendChild(axisButton);

    playerDomBoard.addEventListener("mouseover", hoverHandler);
    playerDomBoard.addEventListener("click", clickHandler);
    playerDomBoard.addEventListener("mouseleave", handleMouseLeaveBoard);

    gameArea.appendChild(playerDomBoard);
  }

  function handleMouseLeaveBoard() {
    let playerSquares = Array.from(playerDomBoard.children);
    let compSquares = Array.from(compDomBoard.children);

    playerSquares.map((square) => {
      square.classList.remove("valid", "invalid");
    });

    compSquares.map((square) => {
      square.classList.remove("battleHover");
    });
  }

  function refreshBoards(playerBoard, compBoard) {
    refreshBoard(playerBoard, playerDomBoard);
    refreshBoard(compBoard, compDomBoard);
  }

  function refreshBoard(board, domBoard) {
    const squares = Array.from(domBoard.children);
    const gameBoard = board.getBoard();

    squares.map((square) => {
      const squareId = Number(square.dataset.squareId);

      // Remove hover state
      square.classList.remove(
        "valid",
        "invalid",
        "battleHover",
        "hit",
        "sunk",
        "shipHit",
        "ship"
      );

      // Add ship locations to player board
      if (domBoard === playerDomBoard) {
        if (gameBoard[squareId].ship) {
          square.classList.add("ship");
        }
      }

      // Checks for hit
      if (gameBoard[squareId].isHit) {
        square.classList.add("hit");
      }

      // Checks for sunk boat
      if (gameBoard[squareId].ship?.isSunk()) {
        square.classList.add("sunk");
      }

      // If ship is hit add effect
      if (gameBoard[squareId].ship && gameBoard[squareId].isHit) {
        square.classList.add("shipHit");
        square.classList.remove("hit");
      }
    });
  }

  function renderPlacementHoverStatus(isValid, shipLocation) {
    let squares = Array.from(playerDomBoard.children);

    squares.map((square) => {
      square.classList.remove("valid", "invalid");
    });

    if (isValid) {
      squares.map((square) => {
        if (shipLocation.includes(Number(square.dataset.squareId))) {
          square.classList.add("valid");
        }
      });
    } else {
      squares.map((square) => {
        if (shipLocation.includes(Number(square.dataset.squareId))) {
          square.classList.add("invalid");
        }
      });
    }
  }

  function cleanUpPlacementPhase(clickHandler, hoverHandler) {
    document.getElementById("axisButton").remove();

    playerDomBoard.removeEventListener("mouseover", hoverHandler);
    playerDomBoard.removeEventListener("click", clickHandler);
  }

  function renderBattlePhase(handleBattleHover, handleBattleClick) {
    playerDomBoard.classList.add("left", "inactive");
    compDomBoard.classList.add("right");

    compDomBoard.addEventListener("mouseover", handleBattleHover);
    compDomBoard.addEventListener("click", handleBattleClick);
    compDomBoard.addEventListener("mouseleave", handleMouseLeaveBoard);

    gameArea.appendChild(compDomBoard);
  }

  function renderBattleHover(square, gameboard) {
    let allSquares = Array.from(compDomBoard.children);

    allSquares.map((element) => {
      element.classList.remove("battleHover");
    });

    if (gameboard[square.dataset.squareId].isHit) {
      return;
    }

    square.classList.add("battleHover");
  }

  function setupPlayerTurn() {
    const instruction = document.getElementById("instruction");
    instruction.innerHTML = "Attack your opponent's board";

    playerDomBoard.classList.add("inactive");
    compDomBoard.classList.remove("inactive");
  }

  function setupComputerTurn() {
    // TODO
    document.getElementById("instruction").innerText = "Computer Turn";
    playerDomBoard.classList.remove("inactive");
    compDomBoard.classList.add("inactive");
  }

  function removeBattleEventListeners(handleBattleClick, handleBattleHover) {
    compDomBoard.removeEventListener("mouseover", handleBattleHover);
    compDomBoard.removeEventListener("click", handleBattleClick);
  }

  function renderEndGame(winner, handlePlayAgain) {
    removeBattleEventListeners();

    playerDomBoard.classList.add("inactive");
    compDomBoard.classList.add("inactive");

    let endModal = document.createElement("div");
    endModal.id = "endModal";

    const winnerText = document.createElement("h2");
    winnerText.innerHTML = `${winner} won the game!`;
    endModal.appendChild(winnerText);

    const playAgainText = document.createElement("p");
    playAgainText.innerHTML = "Would you like to play again?";
    endModal.appendChild(playAgainText);

    const playAgainButton = document.createElement("button");
    playAgainButton.innerHTML = "Play Again";
    playAgainButton.onclick = handlePlayAgain;
    endModal.appendChild(playAgainButton);

    gameArea.appendChild(endModal);
  }

  function cleanUpForPlayAgain(playerBoard, compBoard) {
    while (gameArea.firstChild) {
      gameArea.removeChild(gameArea.firstChild);
    }

    playerDomBoard.classList.remove("left", "inactive");
    compDomBoard.classList.remove("right", "inactive");

    refreshBoards(playerBoard, compBoard);
  }

  async function animateComputerLogic(playerBoard) {
    const squares = Array.from(playerDomBoard.children);

    for (let i = 0; i < 7; i++) {
      // Find square that hasn't been hit
      let sq = Math.floor(Math.random() * 100);
      while (playerBoard.getBoard()[sq].isHit) {
        sq = Math.floor(Math.random() * 100);
      }

      squares[sq].classList.add("battleHover");
      await new Promise((resolve) => setTimeout(resolve, 150));
      squares[sq].classList.remove("battleHover");
    }
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
    cleanUpForPlayAgain,
    animateComputerLogic,
  };
};

module.exports = DOMController;
