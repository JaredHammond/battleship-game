const ComputerLogic = require("../modules/ComputerLogic");
const Gameboard = require("../modules/Gameboard");

// it("can play a completely random move", () => {
//   let board = Gameboard();
//   let comp = ComputerLogic(board);

//   let prevMoves = [];

//   for (let i = 0; i < 100; i++) {
//     let move = comp.randomMove();
//     expect(prevMoves[move]).toBeUndefined();
//     prevMoves[move] = "hit";
//   }
// });

// it("can play optimized random plays (checkerboard pattern)", () => {
//   let board = Gameboard();
//   let comp = ComputerLogic(board);

//   let prevMoves = [];

//   for (let i = 0; i < 50; i++) {
//     let move = comp.optimizedRandomMove();
//     expect(prevMoves[move]).toBeUndefined();
//     prevMoves[move] = "hit";
//   }
// });

// it("will play optimized random play when there are no hit ships when doing best move", () => {
//   let board = Gameboard();
//   let comp = ComputerLogic(board);

//   let prevMoves = [];

//   for (let i = 0; i < 50; i++) {
//     let move = comp.bestMove();
//     expect(prevMoves[move]).toBeUndefined();
//     prevMoves[move] = "hit";
//   }
// });

// it("hits adjacent ship squares when there is already a ship hit (up case)", () => {
//   let board = Gameboard();
//   board.swapAxis(); // set axis to vertical
//   board.placeNextShip(0); // place ship at 0
//   expect(board.receiveAttack(10)).toBe(true); // hit ship at 10

//   let prevMoves = [10];
//   let comp = ComputerLogic(board, prevMoves);

//   let bestMove = comp.bestMove();
//   expect(bestMove).toBe(0);
// });

// it("hits adjacent ship squares when there is already a ship hit (right case)", () => {
//   let board = Gameboard();
//   board.placeNextShip(0); // place ship at 0 - horizontal
//   expect(board.receiveAttack(0)).toBe(true); // hit ship at 10

//   let prevMoves = [0];
//   let comp = ComputerLogic(board, prevMoves);

//   let bestMove = comp.bestMove();
//   expect(bestMove).toBe(1);
// });

// it("hits adjacent ship squares when there is already a ship hit (down case)", () => {
//   let board = Gameboard();
//   board.swapAxis(); // set axis to vertical
//   board.placeNextShip(0); // place ship at 0
//   expect(board.receiveAttack(0)).toBe(true); // hit ship at 10
//   board.receiveAttack(1);

//   let prevMoves = [0];
//   let comp = ComputerLogic(board, prevMoves);

//   let bestMove = comp.bestMove();
//   expect(bestMove).toBe(10);
// });

// it("hits adjacent ship squares when there is already a ship hit (left case)", () => {
//   let board = Gameboard();
//   board.placeNextShip(5); // place ship at 5
//   expect(board.receiveAttack(9)).toBe(true); // hit ship at 10
//   board.receiveAttack(19);

//   let prevMoves = [9];
//   let comp = ComputerLogic(board, prevMoves);

//   let bestMove = comp.bestMove();
//   expect(bestMove).toBe(8);
// });

// it("will continue within the same axis if there are two hits next to each other", () => {
//   let board = Gameboard();
//   board.placeNextShip(12);
//   board.receiveAttack(12);
//   board.receiveAttack(13);

//   let prevMoves = [13, 12];

//   let comp = ComputerLogic(board, prevMoves);

//   let bestMove = comp.bestMove();
//   expect(bestMove).toBe(14);
// });

// it("will attack the other way if it misses when trying to sink a ship", () => {
//   let board = Gameboard();
//   board.placeNextShip(44);
//   board.receiveAttack(45);
//   board.receiveAttack(44);

//   let prevMoves = [44, 45];

//   let comp = ComputerLogic(board, prevMoves);

//   let bestMove = comp.bestMove();
//   expect(bestMove).toBe(43);
//   board.receiveAttack(bestMove);

//   bestMove = comp.bestMove();
//   expect(bestMove).toBe(46);
// });

it("handles a specific case i saw in testing", () => {
  let board = Gameboard();
  board.placeNextShip(90);
  board.receiveAttack(93);
  board.receiveAttack(94);

  let prevMoves = [94, 93];

  let comp = ComputerLogic(board, prevMoves);

  let bestMove = comp.bestMove();
  expect(bestMove).toBe(95);
  board.receiveAttack(bestMove);

  bestMove = comp.bestMove();
  expect(bestMove).toBe(92);
});
