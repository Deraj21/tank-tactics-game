const   Utils = require('./Utilities'),
        Error = require('./ErrorCodes')
    
class Database {
    constructor(){
        this.players = [],
        this.votes = {},
        this.gameStarted = false
    }

    createPlayer(username){
        let newPlayer = {
            name: username,
            health: 3,
            actionTokens: 0,
            range: 2,
            position: { r: 0, c: 0 },
            color: Utils.hashRGB(username),
            isDead: false
        }
        this.players.push(newPlayer)
        
    }

    getPlayer(username){
        let p = this.players.find(p => p.name === username)
        if (p !== null){
            // immutable data
            return Object.assign({}, p, { position: { ...p.position } })
        } else {
            return null
        }
    }

    getPlayers(){
        // immutible data
        return this.players.map(p => {
            return Object.assign({}, p, { position: { ...p.position } })
        })
    }

    updatePlayer(username, payload){
        let i = this.players.findIndex(p => p.name === username)
        let player = { ...this.players[i] }
        this.players[i] = Object.assign({}, player, payload)
    }

    updatePlayers(playerData){
        this.players = [ ...playerData ]
    }

    updateVote(voter, recipient){
        this.votes[voter] = recipient
    }

    getVotes(){
        return { ...this.votes }
    }

    emptyVotes(){
        for (let key in this.votes){
            delete this.votes[key]
        }
    }

    getGameStarted(){
        return this.gameStarted
    }

    setGameStarted(bool){
        this.gameStarted = bool
    }

    resetGame(){
        this.players.length = 0
        this.emptyVotes()
        this.gameStarted = false
    }
}

module.exports = Database