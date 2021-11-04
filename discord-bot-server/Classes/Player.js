import Utils from './Utilities.js'
import Error from './ErrorCodes.js'
import dbHelper from './dbHelper.js'


const Player = {
    /**
     * @param {string} uname - new player's username
     */
    join: function(uname, shortName){
        if (dbHelper.getGameStarted()){
            console.error(Error['004'])
            return '004'
        }

        let alreadyJoined = false
        dbHelper.getPlayers().forEach( p => {
            if (p.name === uname)
                alreadyJoined = true
        })
        if (alreadyJoined){
            console.log(Error['012'])
            return '012'
        }

        dbHelper.createPlayer(uname, shortName)
    },

    /**
     * move - move player in cardinal direction by one
     * @param {string} uname - username of player doing the action
     * @param {string} dir - cardinal direction i.e 'S' or 'NW'
     */
    move: function(uname, dir){
        let player = { ...dbHelper.getPlayer(uname) }

        if (player.actionTokens === 0){
            console.error(Error['003'])
            return '003'
        }

        const playersPos = this.getPlayerPositions()

        // parse string
        dir = dir.toUpperCase()
        if (!Utils.DIRECTIONS.includes(dir)){
            console.error(Error['002'])
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
            console.error(Error['001'])
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
            console.error(Error['008'])
            return '008'
        }

        player.actionTokens--
        dbHelper.updatePlayer(uname, {
            actionTokens: player.actionTokens,
            position: { ...player.position }
        })
    },

    /**
     * shoot - player shoots at coordinate on board
     * @param {string} uname - username of player doing the action
     * @param {string} coords - 2-character coords being aimed at; i.e 'a3' or 'H7'
     * @param {boolean} isShooting - is player shooting or gifting an action point
     */
    shoot: function(uname, coords, isShooting = true){
        let player = dbHelper.getPlayer(uname)
        let { range, position, actionTokens } = player
        let { r, c } = position

        if (actionTokens < 1){
            console.error(Error['003'])
            return '003'
        }

        if (!coords){
            console.error(Error['009'])
            return '009'
        }

        // parse coordinates
        coords = coords ? coords.toUpperCase() : ""
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
            console.error(Error['011'])
            return '011'
        }
        
        // have player take damage
        if (isShooting){
            this.takeDamage(hitPlayer)
        } else {
            this.receiveToken(hitPlayer)
        }

        // remove action token
        player.actionTokens--

        dbHelper.updatePlayer(uname, player)
    },

    /**
     * takeDamage - take 1 health from player, and check if dead
     * @param {string} uname - username of player taking damage
     */
    takeDamage: function(uname){
        let player = dbHelper.getPlayer(uname)
        player.health--
        
        // check death
        if (player.health <= 0){
            player.isDead = true
            player.position = { r: -1, c: -1 }
        }
        
        dbHelper.updatePlayer(uname, {
            health: player.health,
            isDead: player.isDead,
            position: { ...player.position }
        })
    },

    /**
     * giftActionToken - gift another player an action token
     * @param {string} uname - username of player giving the token
     * @param {string} coords - 2-character coords being aimed at; i.e 'a3' or 'H7'
     */
    giftActionToken: function(uname, coords){
        return this.shoot(uname, coords, false)
    },

    /**
     * recieveToken - give player an action token
     * @param {string} uname - username of player recieving token
     */
    receiveToken: function(uname){
        let player = dbHelper.getPlayer(uname)
        player.actionTokens++
        dbHelper.updatePlayer(uname, {
            actionTokens: player.actionTokens
        })
    },
    
    /**
     * upgradeRange - up the player's range by 1
     * @param {string} uname - username of player doing the action
     */
    upgradeRange: function(uname){
        let player = dbHelper.getPlayer(uname)
        if (player.actionTokens < 1){
            console.error(Error['003'])
            return '003'
        }
        player.range++
        player.actionTokens--

        dbHelper.updatePlayer(uname, player)
    },
    
    /**
     * @param {string} voterUname - username of Jurer
     * @param {string} recipientUname - username that the Jurer submitted
     */
    vote: function(voterUname, recipientUname){
        let voter = dbHelper.getPlayer(voterUname)
        let recipient = dbHelper.getPlayer(recipientUname)

        // make sure players exist
        if (voter === null || recipient === null){
            console.error(Error['007'])
            return '007'
        }

        // make sure voter is dead
        if (!voter.isDead){
            console.error(Error['005'])
            return '005'
        }
        // make sure recipient is not dead
        if (recipient.isDead){
            console.error(Error['006'])
            return '006'
        }

        dbHelper.updateVote(voterUname, recipientUname)
    },
    
    /**
     * get all player positions from db
     * @returns {Object} - player positions
     */
    getPlayerPositions: function(){
        return dbHelper.getPlayers().map(p => {
            return {
                name: p.name,
                position: p.position
            }
        })
    },

    /**
     * printInfo - prints out a players info
     * @param {Object} player - player info that will be printed
     * @param {boolean} long - print in long form?
     */
    printInfo: function(player, long = false){
        let { name, shortName, health, actionTokens, range, position, color, isDead } = player
        let { r, c } = position
        if (long){
            return  `-- **${shortName} (${name})${isDead ? ": Juror" : ""}** --\n` + 
                    `health:       ${health}\n` + 
                    `range:        ${range}\n` + 
                    `actionTokens: ${actionTokens}\n` + 
                    `position:     [${r}, ${c}]\n` + 
                    `color:        ${color}\n`
        } else {
            return `**${shortName}** (${name}):   ` +
            (isDead ? Utils.getDeathMessage() + "\n" : `${health} hp,  ${range} range,  ${actionTokens} tokens\n`)
        }
    },

    /**
     * printPlayers - prints info of multiple players
     * @param  {...string} unames - array of player names to print; if empty, will print all players
     */
    printPlayers: function(...unames){
        if (unames.length === 0){
            // print all
            return dbHelper.getPlayers().map( p => this.printInfo(p) ).join("")
        } else {
            return unames.map(uname => this.printInfo( dbHelper.getPlayer(uname) )).join("")
        }
    },
}

export default Player

