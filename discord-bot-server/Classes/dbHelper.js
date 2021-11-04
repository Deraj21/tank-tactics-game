import Utils from './Utilities.js'
import Error from './ErrorCodes.js'
import Database from "@replit/database"
const db = new Database()
/* database 'schema' *

/game/<game_variable>
    /game_started

/game_setting/<setting_name>
    /num_cols
    /num_rows
    /starting_health
    /starting_tokens
    /daily_token_count
    /starting_range

/player/<player_id>/<player_attribute>
    /username
    /nickname
    /health
    /action_tokens
    /range
    /position
    /color
    /is_dead


getGameSettings()
getPlayers()
getPlayer( username )
setGameSetting( setting )

*/
const dbHelper = {
    setGameSetting: function(settingName, value){
        // validate correct data type

        // validate setting exists
            // if doesn't exist, tell user they are creating new
            // else put into database


    },
    getGameSettings: function(){
        
    },
    getGameSetting: function(settingName){

    },
    createPlayer: function(username, shortName){
        let newPlayer = {
            name: username,
            shortName: shortName,
            health: 3,
            actionTokens: 0,
            range: 2,
            position: { r: 0, c: 0 },
            color: Utils.hashRGB(username),
            isDead: false
        }
        this.players.push(newPlayer)
        
    },
    getPlayer: function(username){
        let p = this.players.find(p => p.name === username)
        if (p !== null){
            // immutable data
            return Object.assign({}, p, { position: { ...p.position } })
        } else {
            return null
        }
    },
    getPlayers: function(){
        // immutible data
        return this.players.map(p => {
            return Object.assign({}, p, { position: { ...p.position } })
        })
    },
    updatePlayer: function(username, payload){
        let i = this.players.findIndex(p => p.name === username)
        let player = { ...this.players[i] }
        this.players[i] = Object.assign({}, player, payload)
    },
    updatePlayers: function(playerData){
        this.players = [ ...playerData ]
    },
    updateVote: function(voter, recipient){
        this.votes[voter] = recipient
    },
    getVotes: function(){
        return { ...this.votes }
    },
    emptyVotes: function(){
        for (let key in this.votes){
            delete this.votes[key]
        }
    },
    getGameStarted: function(){
        return this.gameStarted
    },
    setGameStarted: function(bool){
        this.gameStarted = bool
    },
    resetGame: function(){
        this.players.length = 0
        this.emptyVotes()
        this.gameStarted = false

        this.addTestData()
    }
}

export default dbHelper