function ComputerLogic(oppBoard, prevMoves = []) {
  const boardState = oppBoard.getBoard();

  function bestMove() {
    for (let move of prevMoves) {
      // Find most recent ship hit and go from there
      if (boardState[move].ship && !boardState[move].ship.isSunk()) {
        // Search for two hits in a row and keep going in that axis
        let nextMove = continueAttackingInRow(move);
        if (nextMove !== null) {
          prevMoves.unshift(nextMove);
          return nextMove;
        }

        // If it can't go in the same direction, it tries the other direction
        nextMove = attackTheOppositeWay(move);
        if (nextMove !== null) {
          prevMoves.unshift(nextMove);
          return nextMove;
        }

        // Couldn't find another hit square, so hit any adjacent square
        nextMove = attackAnyAdjacentSquare(move);
        if (nextMove !== null) {
          prevMoves.unshift(nextMove);
          return nextMove;
        }
      }
    }

    return optimizedRandomMove();
  }

  function attackTheOppositeWay(initialSquare) {
    for (let i = 0; i < 4; i++) {
      let s = adjacentSquare(initialSquare, i);
      if (s === null) {
        continue;
      }

      if (boardState[s].ship && boardState[s].isHit) {
        while (boardState[s].isHit) {
          s = adjacentSquare(s, i);
          if (s === null) {
            break;
          }
        }
        if (s === null) {
          continue;
        }

        if (!boardState[s].isHit) {
          return s;
        }
      }
    }
    return null;
  }

  function continueAttackingInRow(initialSquare) {
    for (let i = 0; i < 4; i++) {
      let s = adjacentSquare(initialSquare, i);
      if (s === null) {
        continue;
      }

      if (boardState[s].ship && boardState[s].isHit) {
        let nextMove = oppositeAdjacentSquare(initialSquare, i);
        if (nextMove === null) {
          continue;
        }

        if (!boardState[nextMove].isHit) {
          return nextMove;
        }
      }
    }
    return null;
  }

  function attackAnyAdjacentSquare(initialSquare) {
    // Hit non-hit squares around the initial square
    for (let i = 0; i <= 3; i++) {
      let move = adjacentSquare(initialSquare, i);

      if (move === null) {
        continue;
      }

      if (!boardState[move].isHit) {
        return move;
      }
    }

    return null;
  }

  // Accepts a square and a direction which can be a string or a number.
  // Numbers correspond to direction in this order => 0:'up', 1:'right', 2:'down', 3:'left'
  function adjacentSquare(square, direction) {
    switch (direction) {
      case "up":
      case 0:
        return square - 10 >= 0 ? square - 10 : null;

      case "right":
      case 1:
        if (square % 10 > (square + 1) % 10 || square === 99) {
          return null;
        }
        return square + 1;

      case "down":
      case 2:
        return square + 10 <= 99 ? square + 10 : null;

      case "left":
      case 3:
        if (square % 10 < (square - 1) % 10 || square === 0) {
          return null;
        }
        return square - 1;
    }
  }

  function oppositeAdjacentSquare(square, direction) {
    switch (direction) {
      case "up":
      case 0:
        return adjacentSquare(square, 2);

      case "right":
      case 1:
        return adjacentSquare(square, 3);

      case "down":
      case 2:
        return adjacentSquare(square, 0);

      case "left":
      case 3:
        return adjacentSquare(square, 1);
    }
  }

  function optimizedRandomMove() {
    // Only pick tiles in a checkerboard pattern. (Ships must intersect)

    let tensPlace = Math.floor(Math.random() * 10);
    let move;

    // Even rows should have even ones place. Odd rows have odd ones place.
    if (tensPlace % 2 === 0) {
      move = tensPlace * 10 + Math.floor(Math.random() * 5) * 2;
    } else {
      move = tensPlace * 10 + (Math.floor(Math.random() * 5) * 2 + 1);
    }

    while (prevMoves.includes(move)) {
      tensPlace = Math.floor(Math.random() * 10);

      // Even rows should have even ones place. Odd rows have odd ones place.
      if (tensPlace % 2 === 0) {
        move = tensPlace * 10 + Math.floor(Math.random() * 5) * 2;
      } else {
        move = tensPlace * 10 + (Math.floor(Math.random() * 5) * 2 + 1);
      }
    }

    prevMoves.unshift(move);

    return move;
  }

  function randomMove() {
    let move = Math.floor(Math.random() * 100);

    while (prevMoves.includes(move)) {
      move = Math.floor(Math.random() * 100);
    }

    prevMoves.unshift(move);
    return move;
  }

  return {
    randomMove,
    optimizedRandomMove,
    bestMove,
  };

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

module.exports = ComputerLogic;
