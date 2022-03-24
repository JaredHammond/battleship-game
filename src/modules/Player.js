const ComputerLogic = require("./ComputerLogic");

const Player = (oppBoard) => {
  const comp = ComputerLogic(oppBoard);

  function makeMove() {
    return comp.bestMove();
  }

  return {
    makeMove,
  };
};

module.exports = Player;
