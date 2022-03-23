function ComputerLogic(oppBoard) {
    const boardState = oppBoard.getBoard();
    const prevMoves = [];

    function bestMove() {
        for (let move of prevMoves) {
            if (boardState[move].ship && !boardState[move].ship.isSunk()) {
                return keepAttackingShip(move);
            }
        }

        return optimizedRandomMove();
    }

    function keepAttackingShip(initialSquare) {
        let adjacentSquares = []

        for (let i=0; i <= 3; i++) {
            if (adjacentSquares[i] === null) { continue }
            let s = relativeSquare(initialSquare, i);
            
            if (s === null) {
                adjacentSquares[i] = null;

                if (i > 2) {
                    adjacentSquares[i - 2] == null;
                } else {
                    adjacentSquares[i + 2] == null;
                }
            } else {
                // save the actual adjacent square? idk
            }
            
            
        }

        // See if there is another hit square adjacent to our most recent hit square.
        // Attack the square opposite the adjacent hit square
        for (let s in adjacentSquares) {
            if (s === null) { continue; }

            if (boardState[s].ship && !boardState[s].ship.isSunk()) {

            }
        } 


    }

    // Accepts a square and a direction which can be a string or a number.
    // Numbers correspond to direction in this order => 0:'up', 1:'right', 2:'down', 3:'left'
    function relativeSquare(square, direction) {
        switch (direction) {
            case 'up':
            case 0:
                return square - 10 >= 0 ? square - 10 : null;

            case 'down':
            case 1:
                return square + 10 <= 99 ? square + 10 : null;

            case 'right':
            case 2:
                if (square % 10 > (square + 1) % 10) {
                    return null;
                }
                return square + 1;

            case 'left':
            case 3:
                if (square % 10 < (square + 1) % 10) {
                    return null;
                }
                return square - 1;
        }
    }
    
    function optimizedRandomMove() {
        // Only pick even tiles if picking randomly. (Ships must intersect an even square)
    
        let move = Math.floor(Math.random() * 50) * 2;
    
        while (prevMoves.includes(move)) {
          move = Math.floor(Math.random() * 50) * 2;
        }
    
        prevMoves.unshift(move)
    
        return move
    }
    
    function randomMove() {
        let move = Math.floor(Math.random() * 100);
    
        while (prevMoves.includes(move)) {
          move = Math.floor(Math.random() * 100);
        }
    
        prevMoves.unshift(move);
        return move
    }

    return {
        randomMove,
        optimizedRandomMove,
        bestMove,
    }
    
    /*
    
    -Push all moves into an array  !Done
    -Search through array for move that is hit but not sunk  !DONE
    -Once on that square, look for hits (but not sunk) around the hit. Top, right, bottom left
        -Need to have a way to not wrap around to next row on board e.g. 9 -> 10
    -If hit is found around the hit, attack the opposite square. (left is hit, so attack right)
        -If that fails, move in the original direction until there is a hit or a fail
    -
    
    */

}

module.exports = ComputerLogic






