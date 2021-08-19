const   Player = require('./Player'),
        Error = require('./ErrorCodes'),
        Utils = require('./Utilities'),
        db =    require('./Database')

/**
 * Game
 */
class Game {
    constructor(){
        this.players = []
        this.votes = {}
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
        // tally votes
        let { votes } = this
        let tally = {}
        for (let key in votes){
            if (tally[votes[key]]){
                tally[votes[key]]++
            } else {
                tally[votes[key]] = 1
            }
        }
        
        this.players.forEach(player => {
            if (!player.isDead){
                player.actionTokens += numTokens
                if (tally[player.name] >= 3){
                    player.actionTokens += numTokens
                }
            }
        })

        // TODO: 'forget' votes (when add database)
    }

    /**
     * @param {string} voterUname - username of Jurer
     * @param {string} recipientUname - username Jurer submitted
     */
    vote(voterUname, recipientUname){
        let voter = this.getPlayer(voterUname)
        let recipient = this.getPlayer(recipientUname)

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

        this.votes[voterUname] = recipientUname
        console.log(voter.name, this.votes[voterUname])
    }

    /**
     * @param {string} username - new player's username
     */
    addPlayer(username){
        if (this.gameStarted){
            console.error('ERROR: ' + Error['004'])
            return '004'
        }

        let newPlayer = new Player(username, this.getPlayerPositions.bind(this))
        this.players.push(newPlayer)
        return newPlayer
    }

    getPlayer(username){
        return this.players.find(player => player.name === username) || null
    }

    getPlayerPositions(){
        return this.players.map(p => { return {...p.position} })
    }

    printPlayers(...unames){
        if (unames.length === 0){
            // print all
            this.players.forEach(p => {
                p.printInfo()
            })
        } else {
            unames.forEach(uname => {
                this.getPlayer(uname).printInfo()
            })
        }
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
        this.players.forEach(p => {
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