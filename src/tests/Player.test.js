const Player = require('../modules/Player');

it('can make a random legal play', () => {
  const player = Player();
  const move = player.makeMove();

  expect(move[0]).toBeGreaterThanOrEqual(0);
  expect(move[0]).toBeLessThanOrEqual(9);
  expect(move[1]).toBeGreaterThanOrEqual(0);
  expect(move[1]).toBeLessThanOrEqual(9);
})

it('can does not make the same play twice', () => {
  const player = Player();
  const prevMoves = Array(10).fill().map(() => Array(10).fill().map(() => null));

  for (let i=0; i < 100; i++) {
    let [row, col] = player.makeMove();

    expect(prevMoves[row][col]).toBe(null);
    prevMoves[row][col] = 'hit';
  }
})