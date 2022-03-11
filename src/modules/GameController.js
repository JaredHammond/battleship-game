const Gameboard = require("./Gameboard");

function GameController() {
  let placementAxis = 'x';

  const getAxis = () => placementAxis;

  const swapAxis = () => {
    if (placementAxis === 'x') {
      placementAxis = 'y';
    } else {
      placementAxis = 'x';
    }
  }


  return {
    getAxis,
    swapAxis,
  }
}

const renderBoard = () => {
  const placeBoard = document.createElement('div');
  placeBoard.id = 'placeBoard';

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let square = document.createElement('div');
      square.classList.add('square');
      square.dataset.row = i;
      square.dataset.col = j;
      square.addEventListener('hover', e => shipPlacementHover(e))
      square.addEventListener('click', e => shipPlacement(e));
      square.
      placeBoard.appendChild(square);
    }
  }

  const axisControl = document.createElement('div');
  const axisButton = document.createElement('button');
  axisButton

  const gameArea = document.querySelector('#game-area');
  gameArea.appendChild(placeBoard);

}

module.exports = GameController;