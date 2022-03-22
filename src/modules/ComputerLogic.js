function optimizedRandomMove(prevMoves) {
    // Only pick even tiles if picking randomly. Small optimization.

    let move = Math.floor(Math.random() * 50) * 2;

    while (prevMoves[move] !== null) {
      move = Math.floor(Math.random() * 50) * 2;
    }

    prevMoves[move] = 'hit';

    return move
}

function randomMove(prevMoves) {
    let move = Math.floor(Math.random() * 100);

    while (prevMoves[move] !== null) {
      move = Math.floor(Math.random() * 100);
    }

    prevMoves[move] = 'hit';

    return move
}





