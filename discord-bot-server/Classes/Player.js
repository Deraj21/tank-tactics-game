const DIR = ['N','S','W','E','NW','SW','NE','SE']

const   NUM_ROWS = 10,
        NUM_COLS = 10,
        BOUNDS_ERR = "ERROR: tank cannot move out of bounds",
        CARDINAL_DIR_ERR = "ERROR: incorrect cardinal direction",
        NOT_ENOUGH_TOKENS_ERR = 'ERROR: you do not have any action tokens'

/**
 * Player
 */
class Player {
    /**
     * 
     * @param {string} username - player username
     */
    constructor(username){
        this.name = username
        this.health = 3
        this.actionTokens = 0
        this.range = 2
        this.position = { r: 0, c: 0 }
        this.color = '' // TODO: hash color here
    }

    /**
     * @param {string} direction - cardinal direction i.e 'S' or 'NW'
     */
    move(dir){
        if (this.actionTokens === 0){
            console.log(NOT_ENOUGH_TOKENS_ERR)
            return NOT_ENOUGH_TOKENS_ERR
        }
        this.actionTokens--

        // parse string
        dir = dir.toUpperCase()
        if (!DIR.includes(dir)){
            console.log(CARDINAL_DIR_ERR)
            return -1
        }
        let result = dir.split('')
        
        // 1st coord
        switch (result[0]){
            case 'N':
                this.position.r--
                break;
            case 'S':
                this.position.r++
                break;
            case 'W':
                this.position.c--
                break;
            case 'E':
                this.position.c++
                break;
            default:
                break;
        }

        // 2nd coord
        switch (result[1]){
            case 'W':
                this.position.c--
                break;
            case 'E':
                this.position.c++
                break;
            default:
                break;
        }

        // check bounds
        if (this.position.r < 0){
            this.position.r = 0
            console.log(BOUNDS_ERR)
            return -1
        } else if (this.position.r > NUM_ROWS-1){
            this.position.r = NUM_ROWS-1
            console.log(BOUNDS_ERR)
            return -1
        }
        if (this.position.c < 0){
            this.position.c = 0
            console.log(BOUNDS_ERR)
            return -1
        } else if (this.position.c > NUM_COLS-1){
            this.position.c = NUM_COLS-1
            console.log(BOUNDS_ERR)
            return -1
        }
        
    }
    
    upgradeRange(){
        if (this.actionTokens === 0){
            console.log(NOT_ENOUGH_TOKENS_ERR)
            return NOT_ENOUGH_TOKENS_ERR
        }
        this.actionTokens--
        
        this.range++
    }

    printInfo(){
        let { name, health, actionTokens, range, position, color } = this
        let { r, c } = position

        console.log(
            `name:          ${name}\n` + 
            `health:        ${health}\n` + 
            `actionTokens:  ${actionTokens}\n` + 
            `range:         ${range}\n` + 
            `position:      [${r}, ${c}]\n` + 
            `color:         ${color}\n`
        )
    }
}

module.exports = { Player }

