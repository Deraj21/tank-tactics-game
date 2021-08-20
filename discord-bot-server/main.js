const   Game = require('./Classes/Game'),
        Player = require('./Classes/Player'),
        Database = require('./Classes/Database'),
        db = new Database(),
        game = new Game(db),
        player = new Player(db),
        jared = "jared",
        rachel = "rachel",
        addie = "addie",
        tim = "tim"

/**
 * Call callback function <cb> <x> times
 * @param {Number} x - how many time you want the callback to run
 * @param {Function} cb - callback function that you want repeated
 * @param {...any} params - parameters to be passed to the function
 */
const rpt = (x, cb, ...params) => {
  for (let i = 0; i < x; i++){
    cb(...params)
  }
}

// setup
game.addPlayer(jared)
game.addPlayer(rachel)
game.addPlayer(addie)
game.addPlayer(tim)
db.updatePlayer(jared, { position: { r: 4, c: 6 } })
db.updatePlayer(rachel, { position: { r: 2, c: 3 }, health: 1 })
db.updatePlayer(addie, { position: { r: 7, c: 5 }, health: 2 })
db.updatePlayer(tim, { position: { r: 5, c: 6 } })
game.giveDailyTokens(5)

game.printBoard()
player.printPlayers()

/*

  0 1 2 3 4 5 6 7 8 9
A . . . . . . . . . .
B . . . . . . . . . .
C . . . r . . . . . .
D . . . . . . . . . .
E . . . . . . j . . .
F . . . . . . t . . .
G . . . . . . . . . .
H . . . . . a . . . .
I . . . . . . . . . .
J . . . . . . . . . .

*/