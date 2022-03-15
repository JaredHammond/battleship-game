const Player = require('../modules/Player');

it('can make a random legal play', () => {
  const player = Player();
  const move = player.makeMove();

  expect(move).toBeGreaterThanOrEqual(0);
  expect(move).toBeLessThanOrEqual(99);

})

it('can does not make the same play twice', () => {
  const player = Player();
  const prevMoves = Array(100).fill().map(() => null);

  for (let i=0; i < 100; i++) {
    let move = player.makeMove();

    expect(prevMoves[move]).toBe(null);
    prevMoves[move] = 'hit';
  }
})