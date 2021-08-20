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

// setup
game.addPlayer(jared)
game.addPlayer(rachel)
game.addPlayer(addie)
game.addPlayer(tim)
db.updatePlayer(jared, { position: { r: 4, c: 6 } })
db.updatePlayer(rachel, { position: { r: 2, c: 3 } })
db.updatePlayer(addie, { position: { r: 7, c: 5 } })
db.updatePlayer(tim, { position: { r: 5, c: 6 } })
game.giveDailyTokens(5)
game.printBoard()

player.shoot(tim, 'e6')
player.shoot(tim, 'e6')
player.shoot(tim, 'e6')

game.printBoard()

// print
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