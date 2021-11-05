import Utils from './Utilities.js'
import Error from './ErrorCodes.js'
import Database from "@replit/database"
const db = new Database()


const dbHelper = {
    getListObject: function(string, isArr = false){
        return new Promise((resolve, reject) => {
            return db.list(string)
                .then(keys => {
                    let result = isArr ? [] : {}
                    for (let i = 0; i < keys.length; i++){
                        db.get(keys[i]).then(value => {
                            let key = keys[i].split('.')[1]
                            if (isArr){
                                result.push(value)
                            } else {
                                result[key] = value
                            }

                            if ((isArr ? result.length : Object.keys(result).length) === keys.length){
                                console.log('result', result)
                                resolve(result)
                            }
                        })
                    }
                    resolve(result)
                })
                .catch(err => { reject(err) })
        })
    },
    setGameSetting: function(settingName, value){
        // validate correct data type
        // validate setting exists
            // if doesn't exist, tell user they are creating new
            // else put into database

        return db.set(`game_setting.${settingName}`, value)
    },
    getGameSettings: function(){
        return this.getListObject("game_setting.")
    },
    getGameSetting: function(settingName){
        return db.get(`game_setting.${settingName}`)
    },
    /**
     * @param {string} username
     * @param {string} shortName
     */
    createPlayer: function(username, shortName){
        return this.getGameSettings().then(settings => {
            let { starting_health, starting_range, starting_tokens } = settings
            db.set(`player.${username}`, {
                name: username,
                shortName: shortName,
                health: starting_health,
                actionTokens: starting_tokens,
                range: starting_range,
                position: { r: 0, c: 0 },
                color: Utils.hashRGB(username),
                isDead: false
            })
        })
        .catch(err => console.log(err))
    },
    getPlayer: function(username){
        return db.get(`player.${username}`)
    },
    getPlayers: function(){
        return this.getListObject('player.', true)
    },
    updatePlayer: function(username, payload){
        return this.getPlayer(username).then(player => {
            let newPlayer = Object.assign({}, player, payload)
            console.log(newPlayer)

            return db.set(`player.${username}`, newPlayer)
        })
    },
    updateVote: function(voter, recipient){
        return db.set(`vote.${voter}`, recipient)
    },
    getVotes: function(){
        return this.getListObject('vote.')
    },
    empty: function(matchString){
        db.list(matchString)
            .then(keys => {
                keys.forEach(k => db.delete(k))
            })
            .catch(err => {
                console.log(err)
            })
    }
    emptyVotes:   function(){ this.empty('vote.')   },
    emptyPlayers: function(){ this.empty('player.') },
    getGameStarted: function(){ return db.get(`game.game_started`) },
    setGameStarted: function(bool){ return db.set`game.game_started`, bool) },
    resetGame: function(){
        this.emptyPlayers()
        this.emptyVotes()
        this.setGameStarted(false)
    }
}

export default dbHelper