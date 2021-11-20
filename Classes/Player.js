import Utils from './Utilities.js'
import Error from './ErrorCodes.js'
import dbHelper from './dbHelper.js'


const Player = {
    joinGame: function(username, givenShortName, players){
        const shortNameLength = 6
        // if already joined
        if (players.find(p => p.username === username)){
            return '012'
        }
        
        let shortName = ""
        if (givenShortName === undefined || givenShortName === ""){
            shortName = username.split('').splice(0, shortNameLength).join('')
        } else if (givenShortName.length < shortNameLength) {
            shortName = givenShortName + ".".repeat(shortNameLength - givenShortName.length)
        } else if (givenShortName.length > shortNameLength){
            shortName = givenShortName.split('').splice(0, shortNameLength).join('')
        } else {
            shortName = givenShortName
        }

        if (players.find(p => p.shortName === shortName)){
            return '016'
        }

        players.push(
            dbHelper.getNewPlayer(username, shortName)
        )
        return shortName
    },
    move: function(username, dir, players, settings){
        const { num_cols, num_rows } = settings
        let player = players.find(p => p.username === username)

        if (player.actionTokens === 0){
            return '003'
        }

        // parse string
        dir = dir.toUpperCase()
        if (!Utils.DIRECTIONS.includes(dir)){
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
        if (player.position.r < 0 || player.position.r > num_rows-1 || player.position.c < 0 || player.position.c > num_cols-1){
            return '001'
        }
        
        // check ran into other players
        let ranIntoPlayer = false
        players.forEach(p => {
            let pos = p.position
            if (p.username === player.username){
                return
            } else if (pos.r === player.position.r && pos.c === player.position.c){
                ranIntoPlayer = true
                return
            }
        })
        if (ranIntoPlayer){
            return '008'
        }

        player.actionTokens--
        return ''
    },
    /**
     * shoot - player shoots at coordinate on board
     * @param {string} username - username of player doing the action
     * @param {string} coords - 2-character coords being aimed at; i.e 'a3' or 'H7'
     * @param {Array} players - players from the database
     * @param {Object} settings - game settings object from database
     * @param {boolean} isShooting - is player shooting or gifting an action point
     * @param {number} numTokens - (integer) number of tokens being gifted
     */
    shoot: function(username, coords, players, settings, isShooting = true, numTokens){
        let player = players.find(p => p.username === username)

        if (player.actionTokens < 1){
            return '003'
        }
        if (!coords){
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
            return '009'
        }
        let col = parseInt(splitCoords[1])

        // check sufficient range
        if (Math.abs(row - player.position.r) > player.range || Math.abs(col - player.position.c) > player.range){
            return '010'
        }

        // check player at coordinates
        let hitPlayer = null
        players.forEach(pos => {
            if (!pos.isDead && pos.position.r === row && pos.position.c === col){
                hitPlayer = pos
            }
        })
        if (hitPlayer === null){
            return '011'
        }
        
        // have player take damage
        if (isShooting){
            hitPlayer.health--
            // check death
            if (hitPlayer.health <= 0){
                hitPlayer.isDead = true
                hitPlayer.position = { r: -1, c: -1 }
            }
            player.actionTokens--
        } else {
            hitPlayer.actionTokens += numTokens
            player.actionTokens -= numTokens
        }

        return {
            hitPlayer: hitPlayer.shortName,
            player: player.shortName,
            dead: hitPlayer.isDead
        }
    },
    giftActionToken: function(username, players, settings, coords, numTokens = 1){
        return this.shoot(username, coords, players, settings, false, parseInt(numTokens))
    },
    // Not Used (right now)
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
    vote: function(voterName, recipientName, players){
        let voter = players.find(p => p.username = voterName)
        let recipient = players.find(p => p.shortName = recipientName)

        // make sure players exist
        if (voter === null || recipient === null){
            return '007'
        }

        // make sure voter is dead
        if (!voter.isDead){
            return '005'
        }
        // make sure recipient is not dead
        if (recipient.isDead){
            return '006'
        }

    },
    /**
     * printInfo - prints out a players info
     * @param {Object} player - player info that will be printed
     * @param {boolean} long - print in long form?
     */
    printInfo: function(player, long = false){
        let { username, shortName, health, actionTokens, range, position, color, isDead } = player
        let { r, c } = position

        if (long){
            return  `-- **${shortName} (${username})${isDead ? ": Juror" : ""}** --\n` + 
                    `health:       ${health}\n` + 
                    `range:        ${range}\n` + 
                    `actionTokens: ${actionTokens}\n` + 
                    `position:     [${r}, ${c}]\n` + 
                    `color:        ${color}\n`
        } else {
            return `**${shortName}** (${username}):   ` +
            (
                isDead
                ?
                `*${shortName}*` + Utils.getDeathMessage() + "\n"
                :
                `${health} hp,  ${range} range,  ${actionTokens} tokens\n`
            )
        }
    },
    printPlayers: function(players){
        return players.length
            ?
            players.map( p => this.printInfo(p) ).join("")
            :
            Error['014']
    }
}

export default Player

