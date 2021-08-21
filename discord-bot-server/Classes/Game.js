const   Player = require('./Player'),
        Error = require('./ErrorCodes'),
        Utils = require('./Utilities')

/**
 * Game
 */
class Game {
    constructor(db){
        this.db = db
    }

    startGame(){
        this.db.setGameStarted(true)
    }

    resetGame(){
        this.db.resetGame()
    }

    giveDailyTokens(numTokens = 1){
        // tally votes
        let votes = this.db.getVotes()
        let tally = {}
        for (let key in votes){
            if (tally[votes[key]]){
                tally[votes[key]]++
            } else {
                tally[votes[key]] = 1
            }
        }
        
        this.db.getPlayers().forEach(player => {
            if (!player.isDead){
                player.actionTokens += numTokens
                if (tally[player.name] >= 3){
                    player.actionTokens += numTokens
                }
                this.db.updatePlayer(player.name, { actionTokens: player.actionTokens })
            }
        })

        // 'forget' votes
        this.db.emptyVotes()
    }

    printBoard(){
        // create board
        let board = []
        for (let r = 0; r < Utils.NUM_ROWS; r++){
            let row = []
            for (let c = 0; c < Utils.NUM_COLS; c++){
                row.push('.')
            }

            board.push(row)
        }
        // place 'tanks'
        this.db.getPlayers().forEach(p => {
            if (p.isDead){
                return
            }

            let { r, c } = p.position
            board[r][c] = p.name[0]
        })

        // get ready to print
        let text = ' '
        for (let i = 0; i < Utils.NUM_COLS; i++){
            text += ` ${i}`
        }
        text += '\n'
        board.forEach((row, r) => {
            text += '`'
            text += Utils.ROW_NAMES[r] + ' '
            text += row.join(' ') + '`\n'
        })

        return text
    }
}

module.exports = Game