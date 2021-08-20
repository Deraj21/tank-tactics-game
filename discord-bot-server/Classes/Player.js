const   Utils = require('./Utilities'),
        Error = require('./ErrorCodes')

/**
 * Player
 */
class Player {
    constructor(db){
        this.db = db
    }

    /**
     * @param {string} dir - cardinal direction i.e 'S' or 'NW'
     * @param {Array} playersPos - array player positions
     */
    move(uname, dir){
        let player = { ...this.db.getPlayer(uname) }

        if (player.actionTokens === 0){
            console.log(Error['003'])
            return '003'
        }

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
                player.position.r--
                break;
            case 'S':
                player.position.r++
                break;
            case 'W':
                player.position.c--
                break;
            case 'E':
                player.position.c++
                break;
            default:
                break;
        }

        // 2nd coord
        switch (result[1]){
            case 'W':
                player.position.c--
                break;
            case 'E':
                player.position.c++
                break;
            default:
                break;
        }

        // check out of bounds
        if (player.position.r < 0 || player.position.r > Utils.NUM_ROWS-1 || player.position.c < 0 || player.position.c > Utils.NUM_COLS-1){
            console.log(Error['001'])
            return '001'
        }

        // check ran into other players
        let ranIntoPlayer = false
        playersPos.forEach(playerPos => {
            let pos = playerPos.position
            if (playerPos.name === player.name){
                return
            } else if (pos.r === player.position.r && pos.c === player.position.c){
                ranIntoPlayer = true
                return
            }
        })
        if (ranIntoPlayer){
            console.log(Error['008'])
            return '008'
        }

        player.actionTokens--
        this.db.updatePlayer(uname, {
            actionTokens: player.actionTokens,
            position: { ...player.position }
        })
    }

    shoot(uname, coords){
        let player = this.db.getPlayer(uname)
        let { range, position, actionTokens } = player
        let { r, c } = position

        if (actionTokens < 1){
            console.log(Error['003'])
            return '003'
        }

        // parse coordinates
        coords = coords.toUpperCase()
        let splitCoords = coords.split('')
        
        // check valid coordinates
        let row = Utils.ROW_NAMES.findIndex((name, i) => {
            return name === splitCoords[0]
        })
        if (splitCoords.length > 2 || row === -1 || splitCoords[1].match(/\d/) === null){
            console.error(Error['009'])
            return '009'
        }
        let col = parseInt(splitCoords[1])

        // check sufficient range
        if (Math.abs(row - r) > range || Math.abs(col - c) > range){
            console.error(Error['010'])
            return '010'
        }

        // check player at coordinates - '011'
        let playerPositions = this.getPlayerPositions()
        let hitPlayer = ""
        playerPositions.forEach(pos => {
            if (pos.position.r === row && pos.position.c === col){
                hitPlayer = pos.name
            }
        })
        if (!hitPlayer){
            console.log(Error['011'])
            return '011'
        }
        
        // have player take damage
        this.takeDamage(hitPlayer)

        // remove action token
        player.actionTokens--

        this.db.updatePlayer(uname, player)
    }

    takeDamage(uname){
        let player = this.db.getPlayer(uname)
        player.health--

        // check death
        if (player.health <= 0){
            player.isDead = true
            player.position = { r: -1, c: -1 }
        }

        this.db.updatePlayer(uname, player)
    }
    
    upgradeRange(uname){
        let player = this.db.getPlayer(uname)
        if (player.actionTokens < 1){
            console.log(Error['003'])
            return '003'
        }
        player.range++
        player.actionTokens--

        this.db.updatePlayer(uname, player)
    }

    getPlayerPositions(){
        return this.db.getPlayers().map(p => {
            return {
                name: p.name,
                position: p.position
            }
        })
    }

    printInfo(player, long = false){
        let { name, health, actionTokens, range, position, color } = player
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

    printPlayers(...unames){
        if (unames.length === 0){
            // print all
            this.db.getPlayers().forEach(p => {
                this.printInfo(p)
            })
        } else {
            unames.forEach(uname => {
                this.printInfo( this.db.getPlayer(uname) )
            })
        }
    }
}

module.exports = Player

