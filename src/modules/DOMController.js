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
      square.classList.remove('valid', 'invalid', 'battleHover');

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
    compDomBoard.classList.add('right')

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

  return {
    renderPlacementPhase,
    renderPlacementHoverStatus,
    refreshBoards,
    cleanUpPlacementPhase,
    renderBattlePhase,
    renderBattleHover,
    setupComputerTurn,
    setupPlayerTurn,
  }
}

module.exports = DOMController
