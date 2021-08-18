const { Player } = require('./Player')

const   NUM_ROWS = 10,
        NUM_COLS = 10,
        NO_ADD_PLAYER_MSG = "ERROR: cannot add players once game has started"

/**
 * Game
 */
class Game {
    constructor(){
        this.players = []
        this.votes = []
        this.gameStarted = false
        this.gameEnded = true
    }

    startGame(){
        this.gameStarted = true
    }

    endGame(){
        this.gameEnded = true
    }

    giveDailyTokens(numTokens = 1){
        // TODO: tally votes

        this.players.forEach(player => {
            player.actionTokens += numTokens
        })
    }

    /**
     * addPlayer
     * @param {string} username - new player's username
     */
    addPlayer(username){
        if (this.gameStarted){
            console.error(NO_ADD_PLAYER_MSG)
            return -1
        }

        this.players.push(
            new Player(username)
        )
    }

    getPlayer(username){
        return this.players.find(player => player.name === username) || -1
    }

    printPlayerInfo(){
        this.players.forEach(p => {
            p.printInfo()
        })
    }
}

module.exports = { Game }