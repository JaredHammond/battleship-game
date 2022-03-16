const DOMController = () => {

  // Creates a set of dom nodes that represents the gameboard
  const domBoard = (playerName) => {
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
  const renderPlacementPhase = (playerBoard) => {
    const axisButton = document.createElement('button');
    axisButton.innerHTML = 'Swap Ship Axis';
    axisButton.addEventListener('click', playerBoard.swapAxis)

    gameArea.appendChild(axisButton);

    let squares = Array.from(playerDomBoard.children)

    squares.forEach(square => {
      square.addEventListener('mouseenter', e => shipPlacementHover(e, playerBoard))
      square.addEventListener('click', e => shipPlacement(e, playerBoard));
    })

    gameArea.appendChild(playerDomBoard);
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
  
  const shipPlacementHover = (e, playerBoard) => {
    const squareId = Number(e.target.dataset.squareId);
    
    const {isValid, shipLocation} = playerBoard.isPlacementHoverValid(squareId);

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


  function shipPlacement(e, playerBoard) {
    const squareId = Number(e.target.dataset.squareId);

    const isSuccessful = playerBoard.placeNextShip(squareId);

    if (isSuccessful) {
      refreshBoard(playerBoard, playerDomBoard);
    }

  }

  return {
    renderPlacementPhase,
    shipPlacementHover,
  }
}

module.exports = DOMController
