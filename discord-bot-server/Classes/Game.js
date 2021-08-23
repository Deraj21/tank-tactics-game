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
        this.randomizePlayerPositions()
    }

    resetGame(){ this.db.resetGame() }

    randomizePlayerPositions(){
        // create flat array of all coordinates
        let coords = []
        for (let r = 0; r < Utils.NUM_ROWS; r++){
            for (let c = 0; c < Utils.NUM_COLS; c++){
                coords.push(r + '-' + c)
            }
        }

        // get players
        let players = this.db.getPlayers().map(player => {
            // for each player, splice coordinate from the list
            let coordinates = Utils.randomFromList(coords).split('-')
            player.position.r = parseInt(coordinates[0])
            player.position.c = parseInt(coordinates[1])

            return player
        })

        // update database
        this.db.updatePlayers(players)
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
                player.actionTokens += parseInt(numTokens)
                if (tally[player.name] >= 3){
                    player.actionTokens += parsInt(numTokens)
                }
                this.db.updatePlayer(player.name, { actionTokens: player.actionTokens })
            }
        })

        // 'forget' votes
        this.db.emptyVotes()
    }

    printBoard(small = false){
        // create board
        let board = []
        let healths = {}
        for (let r = 0; r < Utils.NUM_ROWS; r++){
            let row = []
            for (let c = 0; c < Utils.NUM_COLS; c++){
                row.push(small ? '.' : '   ')
            }

            board.push(row)
        }
        // place 'tanks'
        this.db.getPlayers().forEach(p => {
            if (p.isDead){
                return
            }

            let { r, c } = p.position
            board[r][c] = small ? p.name[0] : p.shortName
            if (!small) {
                healths[p.shortName] = p.health
            }
        })

        // column labels
        let text = small ? ' ' : ' '
        for (let i = 0; i < Utils.NUM_COLS; i++){
            text += small ? ` ${i}` : `   ${i}`
        }
        text += '\n'
        if (!small){
            text += "  " + " _ _".repeat(Utils.NUM_COLS) + "\n"
        }

        // rows
        board.forEach((row, r) => {
            // text += ''
            text += Utils.ROW_NAMES[r] + ' '
            if (small){
                text += row.join(' ') + '\n'
            } else {
                text += '|' + row.join('|') + "|\n"
                text += "  |"
                row.forEach(c => {
                    text += "_" + (healths[c] ? healths[c] : " ") + "_|"
                })
                text += "\n"
            }
        })

        return text
    }
}

module.exports = Game
/*
    0   1   2   3   4   5   6   7   8   9
   _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
A |der|   |   |   |   |   |   |   |   |   |
  |_1_|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|
B |   |   |   |   |   |   |   |   |   |   |
  |_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|
C |   |   |   |   |   |pea|   |   |   |   |
  |_ _|_ _|_ _|_ _|_ _|_1_|_ _|_ _|_ _|_ _|
C |   |aby|   |   |   |   |   |   |   |   |
  |_ _|_2_|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|
E |   |   |doo|   |   |   |   |   |   |   |
  |_ _|_ _|_3_|_ _|_ _|_ _|_ _|_ _|_ _|_ _|
F |   |   |   |   |   |   |   |   |   |   |
  |_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|
G |   |   |   |   |   |   |   |som|   |   |
  |_ _|_ _|_ _|_ _|_ _|_ _|_ _|_1_|_ _|_ _|
H |   |   |   |   |   |   |   |   |   |   |
  |_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|
I |   |   |   |   |   |   |   |   |   |   |
  |_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|
J |   |   |   |   |   |   |   |   |   |   |
  |_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|

*/