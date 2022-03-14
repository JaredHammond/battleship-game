const DOMController = require('./modules/DOMController');
const Gameboard = require('./modules/Gameboard');
const Player = require('./modules/Player');

const dom = DOMController()
const playerBoard = Gameboard();
const opponent = Player();
const oppBoard = Gameboard();

dom.renderPlacementPhase(playerBoard);