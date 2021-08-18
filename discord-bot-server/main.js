const { Game } = require('./Classes/Game')

let game = new Game()

// setup
game.addPlayer('JerrodMichael')
game.addPlayer('AbyssalMoth')
game.giveDailyTokens(5)

// player actions
game.getPlayer('AbyssalMoth')
    .move('SE')
game.getPlayer('AbyssalMoth')
    .upgradeRange()

// result
game.getPlayer('AbyssalMoth')
    .printInfo()