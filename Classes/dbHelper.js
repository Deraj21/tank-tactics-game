import dotenv from 'dotenv'
dotenv.config()
import Utils from './Utilities.js'
import Error from './ErrorCodes.js'
import Database from "@replit/database"
const db = new Database()


const dbHelper = {
    // get
    getGameSettings: function(){
        return db.get("game_settings")
    },
    getPlayers: function(){
        return db.get('players')
    },
    getVotes: function(){
        return db.get('votes')
    },

    // update
    updateGameSettings: function(settings){
        return db.set('game_settings', settings)
    },
    updatePlayers: function(players){
        return db.set('players', players)
    },
    updateVotes: function(votes){
        return db.set('votes', votes)
    },

    // empty
    emptyVotes: function(){
        db.set('votes', {})
    },
    emptyPlayers: function(){
        db.set('players', [])
    },

    // gameStarted
    getGameStarted: function(){
        return db.get(`game.game_started`)
    },
    setGameStarted: function(bool){
        return db.set(`game.game_started`, bool)
    },

    getNewPlayer: function(username, shortName, settings){
        const { starting_health, starting_tokens, starting_range } = settings
        return {
            username: username,
            shortName: shortName,
            health: starting_health,
            actionTokens: starting_tokens,
            range: starting_range,
            position: { r: 0, c: 0 },
            color: Utils.hashRGB(username),
            isDead: false
        }
    },
    resetGame: function(){
        this.emptyPlayers()
        this.emptyVotes()
        this.setGameStarted(false)
    },
    /**
     * whenever a new setting is added, a corresponding validation function needs to be added
     * each function takes in the setting value, and returns true or false whether it is valid or not
     * @param {*} settingName 
     * @returns function that validates the setting
     }}
     */
    validateSetting: function(settingName){
        return {
            num_rows: n => n > 0,
            num_cols: this.num_rows,
            daily_token_count: this.num_rows,
            starting_health: this.num_rows,
            starting_tokens: n => n >= 0,
            starting_range: this.num_rows
        }[settingName]
    },
    getDummyData: function(settings){
        return Utils.dummyUsernames.map(username => {
            return this.getNewPlayer(username, username.slice(0, 6), settings)
        })
    },
    logAll: function(string = ''){
        return db.list(string)
            .then(keys => {
                Promise.all(
                    keys.map(k => {
                        return db.get(k).then(v => {
                            return {k, v}
                        })
                        // return db.delete(k).then(res => res)
                    })
                )
                .then(response => console.log(response))
            })
    }
}

export default dbHelper