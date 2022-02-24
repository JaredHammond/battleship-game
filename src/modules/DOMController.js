const Gameboard = require("./Gameboard");

exports.renderBoard = () => {
  const placeBoard = document.createElement('div');
  placeBoard.id = 'placeBoard';

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let square = document.createElement('div');
      square.classList.add('square');
      square.dataset.row = i;
      square.dataset.col = j;
      square.addEventListener('click', () => {alert('click!')});
      placeBoard.appendChild(square);
    }
  }

  const gameArea = document.querySelector('#game-area');
  gameArea.appendChild(placeBoard);

}