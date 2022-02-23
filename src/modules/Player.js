const Player = () => {
  const prevMoves = Array(10).fill().map(() => Array(10).fill().map(() => null))

  const makeMove = () => {
    let row = Math.floor(Math.random() * 10);
    let col = Math.floor(Math.random() * 10);

    while (prevMoves[row][col] !== null) {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
    }

    prevMoves[row][col] = 'hit';

    return [row, col]
  }

  return {
    makeMove,
  }
}

module.exports = Player;