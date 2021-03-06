const Gameboard = require('../modules/Gameboard')
const Ship = require('../modules/Ship');

it('makes a 10x10 blank gameboard', () => {
  const gameboard = Gameboard();
  expect(gameboard.getBoard()).toEqual(
    [
      {isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},
      {isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},
      {isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},
      {isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},
      {isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},
      {isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},
      {isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},
      {isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},
      {isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},
      {isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null},{isHit: false, ship: null}
    ]
  )
})

it('places a ship in the horizontal direction', () => {
  const ship = Ship(5);
  const gameboard = Gameboard();

  gameboard.placeShip(ship, 'horizontal', 0);

  expect(gameboard.getBoard()[0].ship).toEqual(ship);
  expect(gameboard.getBoard()[1].ship).toEqual(ship);
  expect(gameboard.getBoard()[2].ship).toEqual(ship);
  expect(gameboard.getBoard()[3].ship).toEqual(ship);
  expect(gameboard.getBoard()[4].ship).toEqual(ship);
  expect(gameboard.getBoard()[5].ship).toBe(null);
})

it('places a ship in the vertical direction', () => {
  const ship = Ship(5);
  const gameboard = Gameboard();

  gameboard.placeShip(ship, 'vertical', 0);

  expect(gameboard.getBoard()[0].ship).toEqual(ship);
  expect(gameboard.getBoard()[10].ship).toEqual(ship);
  expect(gameboard.getBoard()[20].ship).toEqual(ship);
  expect(gameboard.getBoard()[30].ship).toEqual(ship);
  expect(gameboard.getBoard()[40].ship).toEqual(ship);
  expect(gameboard.getBoard()[50].ship).toBe(null);
})

it("validates ship placement if there is a ship already there", () => {
  const ship1 = Ship(5);
  const ship2 = Ship(5);
  const gameboard = Gameboard();

  gameboard.placeShip(ship1, 'horizontal', 0);

  // Check the exact same placement
  expect(gameboard.isShipPlacementValid(ship2, 'horizontal', 0).isValid).toBe(false);

  // Check an overlapping, but non-identical placement
  expect(gameboard.isShipPlacementValid(ship2, 'vertical', 0).isValid).toBe(false);

  // Check true case (placement is valid)
  expect(gameboard.isShipPlacementValid(ship2, "horizontal", 10).isValid).toBe(true);
});

it('validates ship placement in cases where the ship would go off the board horizontally', () => {
  const ship = Ship(5);
  const gameboard = Gameboard();

  expect(gameboard.isShipPlacementValid(ship, 'horizontal', 6).isValid).toBe(false);
  expect(gameboard.isShipPlacementValid(ship, 'horizontal', 5).isValid).toBe(true);
})

it('validates ship placement in cases where the ship would go off the board vertically', () => {
  const ship = Ship(5);
  const gameboard = Gameboard();

  expect(gameboard.isShipPlacementValid(ship, 'vertical', 60).isValid).toBe(false);
  expect(gameboard.isShipPlacementValid(ship, 'vertical', 50).isValid).toBe(true);
})

it('will not place a ship if the placement is invalid', () => {
  const ship = Ship(5);
  const ship2 = Ship(5);
  const gameboard = Gameboard();

  gameboard.placeShip(ship, 'horizontal', 0);

  // Invalid placements
  gameboard.placeShip(ship2, 'horizontal', 7)
  gameboard.placeShip(ship2, 'vertical', 60)

  expect(gameboard.getBoard()[0].ship).toEqual(ship);
  expect(gameboard.getBoard()[90].ship).toBe(null);
  expect(gameboard.getBoard()[9].ship).toBe(null);
})

it('can receive a hit and mark the spot as hit', () => {
  const gameboard = Gameboard();

  let result = gameboard.receiveAttack(0);

  expect(result).toBe(true);
  expect(gameboard.getBoard()[0].isHit).toBe(true);
})

it('rejects hits in places already hit', () => {
  const gameboard = Gameboard();

  gameboard.receiveAttack(0);

  let badResult = gameboard.receiveAttack(0);

  expect(badResult).toBe(false);
  expect(gameboard.getBoard()[0].isHit).toBe(true);
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


  gameboard.placeShip(ship, 'horizontal', 0);
  gameboard.receiveAttack(0)

  expect(ship.isHit).toBe(true);

})

it('lists ships in an accessible array', () => {
  const gameboard = Gameboard();

  expect(JSON.stringify(gameboard.getShips())).toBe(JSON.stringify([Ship(5), Ship(4), Ship(3), Ship(3), Ship(2)]));
})

it('can tell when all ships are sunk', () => {
  const gameboard = Gameboard();

  const ships = gameboard.getShips();

  expect(gameboard.allShipsSunk()).toBe(false);

  for (let ship of ships) {
    while (!ship.isSunk()) {
      ship.hit();
    }
  }

  expect(gameboard.allShipsSunk()).toBe(true);
})

it('controls the placement axis', () => {
  const gameboard = Gameboard();

  // Initial state
  expect(gameboard.getAxis()).toBe('horizontal');
  
  // Swap axis
  gameboard.swapAxis();
  expect(gameboard.getAxis()).toBe('vertical');
});

it('iterates through the ships of the player for placement', () => {
  const gameboard = Gameboard();
  
  gameboard.placeNextShip(0);

  gameboard.swapAxis();
  gameboard.placeNextShip(9);

  expect(gameboard.getBoard()[0].ship).toBeTruthy();
  expect(gameboard.getBoard()[9].ship).toBeTruthy();

  expect(gameboard.getBoard()[0].ship.getLength()).not.toBe(gameboard.getBoard()[9].ship.getLength());
})

it('returns the ship location along with boolean when checking valid ship placement', () => {
  const ship = Ship(5);
  const gameboard = Gameboard();

  let invalidResult = gameboard.isShipPlacementValid(ship, 'vertical', 60)
  let validResult = gameboard.isShipPlacementValid(ship, 'vertical', 50)

  expect(invalidResult.isValid).toBe(false);
  expect(invalidResult.shipLocation).toEqual([60, 70, 80, 90])

  expect(validResult.isValid).toBe(true);
  expect(validResult.shipLocation).toEqual([50, 60, 70, 80, 90])
})

it('can randomly place ships on the board', () => {
  const gameboard = Gameboard();

  gameboard.randomShipPlacement();

  let board = gameboard.getBoard();

  let shipSquareCount = board.reduce((prev, curr) => curr.ship ? prev + 1 : prev, 0)

  expect(shipSquareCount).toBe(17);
})
