const   Utils = require('./Utilities'),
        Error = require('./ErrorCodes')

/**
 * Player
 */
class Player {
    /**
     * 
     * @param {string} username - player username
     */
    constructor(username, getPlayerPositions){
        this.name = username
        this.health = 3
        this.actionTokens = 0
        this.range = 2
        this.position = { r: 0, c: 0 }
        this.color = Utils.hashRGB(username)
        this.isDead = false

        this.getPlayerPositions = getPlayerPositions
    }

    /**
     * @param {string} dir - cardinal direction i.e 'S' or 'NW'
     * @param {Array} playersPos - array player positions
     */
    move(dir){
        if (this.actionTokens === 0){
            console.log(Error['003'])
            return '003'
        }

        let oldPos = { ...this.position }
        const playersPos = this.getPlayerPositions()

        // parse string
        dir = dir.toUpperCase()
        if (!Utils.DIRECTIONS.includes(dir)){
            console.log(Error['002'])
            return '002'
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

        // check out of bounds
        if (this.position.r < 0 || this.position.r > Utils.NUM_ROWS-1 || this.position.c < 0 || this.position.c > Utils.NUM_COLS-1){
            this.position = { ...oldPos }
            console.log(Error['001'])
            return '001'
        }

        // check ran into other players
        let ranIntoPlayer = false
        playersPos.forEach(pos => {
            if (pos.r === this.position.r && pos.c === this.position.c){
                ranIntoPlayer = true
                return
            }
        })
        if (ranIntoPlayer){
            this.position = { ...oldPos }
            console.log(Error['008'])
            return '008'
        }
        
        this.actionTokens--
        
    }

    shoot(coords){
        // parse coordinates
        coords = coords.toUpperCase()
        let splitCoords = coords.split('')
        // check valid coordinates
        let row = Utils.ROW_NAMES.findIndex((name, i) => {
            return name === splitCoords[0]
        })
        if (row === -1 || splitCoords[1].match(/\d/) === null){
            console.log("ERROR: " + Error['009'])
            return '009'
        }
        
        let col = parseInt(splitCoords[1])

        console.log(row, col)
        

        // check sufficient action points

        // check sufficient range

    }
    
    upgradeRange(){
        if (this.actionTokens === 0){
            console.log(Error['003'])
            return '003'
        }
        this.range++
        this.actionTokens--
    }

    printInfo(long = false){
        let { name, health, actionTokens, range, position, color } = this
        let { r, c } = position
        if (long){
            console.log(
                `name:          ${name}\n` + 
                `health:        ${health}\n` + 
                `range:         ${range}\n` + 
                `actionTokens:  ${actionTokens}\n` + 
                `position:      [${r}, ${c}]\n` + 
                `color:         ${color}\n`
            )
        } else {
            console.log(
                `${name}: ${health}hp ${range}r ${actionTokens}at`
            )
        }
    }
}

module.exports = Player

