const Player = require("../modules/Player");
const Gameboard = require("../modules/Gameboard");

it("can make a random legal play", () => {
  const board = Gameboard();
  const player = Player(board);
  const move = player.makeMove();

  expect(move).toBeGreaterThanOrEqual(0);
  expect(move).toBeLessThanOrEqual(99);
});

it("can does not make the same play twice", () => {
  const board = Gameboard();
  const player = Player(board);
  const prevMoves = Array(100)
    .fill()
    .map(() => null);

  for (let i = 0; i < 50; i++) {
    let move = player.makeMove();

    expect(prevMoves[move]).toBe(null);
    prevMoves[move] = "hit";
  }
});
