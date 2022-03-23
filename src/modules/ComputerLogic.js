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

/*

-Push all moves into an array
-Search through array for move that is hit but not sunk
-Once on that array, look for hits (but not sunk) around the hit. Top, right, bottom left
    -Need to have a way to not wrap around to next row on board e.g. 9 -> 10
-If hit is found around the hit, attack the opposite square. (left is hit, so attack right)
    -If that fails, move in the original direction until there is a hit or a fail
-

*/





