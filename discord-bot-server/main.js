const Game = require('./Classes/Game')

let game = new Game()

// setup
const   jared = game.addPlayer('jared'),
        rachel = game.addPlayer('rachel'),
        addie = game.addPlayer('addie'),
        tim = game.addPlayer('tim')

jared.position =    { r: 3, c: 6 }
rachel.position =   { r: 2, c: 3 }
addie.position =    { r: 7, c: 5 }
tim.position =      { r: 5, c: 6 }
game.printBoard()

// tokens
game.giveDailyTokens(5)

// moving

// shooting
tim.shoot('a6')

// print
game.printPlayers()