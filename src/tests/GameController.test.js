const GameController = require('../modules/GameController');

it('controls the placement axis', () => {
    const dom = GameController();

    // Initial state
    expect(dom.getAxis()).toBe('x');
    
    // Swap axis
    dom.swapAxis();
    expect(dom.getAxis()).toBe('y');
})