const   Utils = require('./Utilities'),
        Error = require('./ErrorCodes')

// initial data
let players = [],
    votes = {},
    gameStarted = false,
    gameEnded = false

class Database {
    constructor(){
        
    }
    
    createPlayer(username){
        players.push({
            name: username,
            health: 3,
            actionTokens: 0,
            range: 2,
            position: { r: 0, c: 0 },
            color: Utils.hashRGB(username),
            isDead: false
        })
        
    }

    getPlayer(username){
        return { ...players.find(p => p.name === username) }
    }

    getPlayers(){
        return { ...players }
    }

    updatePlayer(username, payload){
        player = players.find(p => p.name === username)
        player = Object.assign({}, player, payload)
        return { ...player }
    }

    updatePlayers(playerData){
        players = [ ...playerData ]
    }

    updateVote(voter, recipient){
        votes[voter] = recipient
    }

    getVotes(){
        return { ...votes }
    }

    emptyVotes(){
        for (let key in votes){
            delete votes[key]
        }
    }

    getGameStarted(){
        return gameStarted
    }

    setGameStarted(bool){
        gameStarted = bool
    }

    getGameEnded(){
        return gameEnded
    }

    setGameEnded(bool){
        gameEnded = bool
    }

    resetGame(){
        players.length = 0
        this.emptyVotes
        gameStarted = false
        gameEnded = false
    }

}

module.exports = Database