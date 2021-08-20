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

    endGame(){
        this.db.setGameEnded(true)
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

    /**
     * @param {string} voterUname - username of Jurer
     * @param {string} recipientUname - username that the Jurer submitted
     */
    vote(voterUname, recipientUname){
        let voter = this.db.getPlayer(voterUname)
        let recipient = this.db.getPlayer(recipientUname)

        // make sure players exist
        if (voter === null || recipient === null){
            console.log(Error['007'])
            return '007'
        }

        // make sure voter is dead
        if (!voter.isDead){
            console.log(Error['005'])
            return '005'
        }
        // make sure recipient is not dead
        if (recipient.isDead){
            console.log(Error['006'])
            return '006'
        }

        this.db.updateVote(voterUname, recipientUname)
    }

    /**
     * @param {string} username - new player's username
     */
    addPlayer(username){
        if (this.db.getGameStarted()){
            console.error('ERROR: ' + Error['004'])
            return '004'
        }

        this.db.createPlayer(username)
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
            text += Utils.ROW_NAMES[r] + ' '
            text += row.join(' ') + '\n'
        })

        console.log(text)
    }
}

module.exports = Game