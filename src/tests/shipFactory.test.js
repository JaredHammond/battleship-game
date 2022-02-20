const Ship = require('../factories/shipFactory')

it('creates a ship object with a given length', () => {
  const ship = Ship(5);
  expect(ship.getLength()).toBe(5);
})

it('accepts a hit and returns whether the ship is sunk accurately', () => {
  const ship = Ship(3);
  ship.hit();
  expect(ship.isSunk()).toBe(false);
  ship.hit();
  expect(ship.isSunk()).toBe(false);
  ship.hit();
  expect(ship.isSunk()).toBe(true);
})

