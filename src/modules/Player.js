const Player = () => {
  const prevMoves = Array(100).fill().map(() => null)

  const makeMove = () => {
    let move = Math.floor(Math.random() * 100);

    while (prevMoves[move] !== null) {
      move = Math.floor(Math.random() * 100);
    }

    prevMoves[move] = 'hit';

    return move
  }

  return {
    makeMove,
  }
}

module.exports = Player;