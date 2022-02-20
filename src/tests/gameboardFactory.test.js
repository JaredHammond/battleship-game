const Gameboard = require('../factories/gameboardFactory')
const Ship = require('../factories/shipFactory');

it('makes a 10x10 blank gameboard', () => {
  const gameboard = Gameboard();
  expect(gameboard.getBoard()).toEqual(
    [
      [{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},],
      [{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},],
      [{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},],
      [{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},],
      [{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},],
      [{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},],
      [{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},],
      [{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},],
      [{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},],
      [{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},],
    ]
  )
})

it('places a ship in the horizontal direction', () => {
  const ship = Ship(5);
  const gameboard = Gameboard();

  gameboard.placeShip(ship, 'horizontal', [0,0]);

  expect(gameboard.getBoard()[0][0].ship).toEqual(ship);
  expect(gameboard.getBoard()[0][1].ship).toEqual(ship);
  expect(gameboard.getBoard()[0][2].ship).toEqual(ship);
  expect(gameboard.getBoard()[0][3].ship).toEqual(ship);
  expect(gameboard.getBoard()[0][4].ship).toEqual(ship);
  expect(gameboard.getBoard()[0][5].ship).toBe(null);
})

it('places a ship in the vertical direction', () => {
  const ship = Ship(5);
  const gameboard = Gameboard();

  gameboard.placeShip(ship, 'vertical', [0,0]);

  expect(gameboard.getBoard()[0][0].ship).toEqual(ship);
  expect(gameboard.getBoard()[1][0].ship).toEqual(ship);
  expect(gameboard.getBoard()[2][0].ship).toEqual(ship);
  expect(gameboard.getBoard()[3][0].ship).toEqual(ship);
  expect(gameboard.getBoard()[4][0].ship).toEqual(ship);
  expect(gameboard.getBoard()[5][0].ship).toBe(null);
})

it("validates ship placement if there is a ship already there", () => {
  const ship1 = Ship(5);
  const ship2 = Ship(5);
  const gameboard = Gameboard();

  gameboard.placeShip(ship1, 'horizontal', [0,0]);

  // Check the exact same placement
  expect(gameboard.isShipPlacementValid(ship2, 'horizontal', [0,0])).toBe(false);

  // Check an overlapping, but non-identical placement
  expect(gameboard.isShipPlacementValid(ship2, 'vertical', [0,0])).toBe(false);

  // Check true case (placement is valid)
  expect(gameboard.isShipPlacementValid(ship2, "horizontal", [1,0])).toBe(true);
});

it('validates ship placement in cases where the ship would go off the board horizontally', () => {
  const ship = Ship(5);
  const gameboard = Gameboard();

  expect(gameboard.isShipPlacementValid(ship, 'horizontal', [6, 0])).toBe(false);
  expect(gameboard.isShipPlacementValid(ship, 'horizontal', [5, 0])).toBe(true);
})

it('validates ship placement in cases where the ship would go off the board vertically', () => {
  const ship = Ship(5);
  const gameboard = Gameboard();

  expect(gameboard.isShipPlacementValid(ship, 'vertical', [0,6])).toBe(false);
  expect(gameboard.isShipPlacementValid(ship, 'horizontal', [0, 5])).toBe(true);
})

it('will not place a ship if the placement is invalid', () => {
  const ship = Ship(5);
  const ship2 = Ship(5);
  const gameboard = Gameboard();

  gameboard.placeShip(ship, 'horizontal', [0,0]);

  // Invalid placements
  gameboard.placeShip(ship2, 'horizontal', [7,0])
  gameboard.placeShip(ship2, 'vertical', [0,6])

  expect(gameboard.getBoard()[0][0].ship).toEqual(ship);
  expect(gameboard.getBoard()[9][0].ship).toBe(null);
  expect(gameboard.getBoard()[0][9].ship).toBe(null);
})

it('can receive a hit and mark the spot as hit', () => {
  const gameboard = Gameboard();

  gameboard.receiveAttack(0,0);

  expect(gameboard.getBoard()[0][0].isHit).toBe(true);
})

it('passes hits onto ships if they exist', () => {
  const gameboard = Gameboard();

  // Mock ship
  const ship = {
    isHit: false,
    hit: function() {
      this.isHit = true;
    },
    getLength: () => {
      return 3;
    }
  }


  gameboard.placeShip(ship, 'horizontal', [0,0]);
  gameboard.receiveAttack(0,0)

  expect(ship.isHit).toBe(true);

})

it('can test when a ship has been sunk', () => {
  const gameboard = Gameboard();

  expect(gameboard.getShips()).toEqual([Ship(5), Ship(4), Ship(3), Ship(3), Ship(2)]);
})

