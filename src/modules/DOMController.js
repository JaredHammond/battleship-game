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
    
    const [isValid, shipCoords] = playerBoard.isPlacementHoverValid([row, col]);

    let squares = Array.from(playerDomBoard.children);

    if (isValid) {
      squares.map(square => {
        //working on adding classes to squares
      })
    }
  }

  return {
    renderPlacementPhase,
    shipPlacementHover,
  }
}

module.exports = DOMController
