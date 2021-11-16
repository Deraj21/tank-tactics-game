import Utils from './Utilities.js'
import Error from './ErrorCodes.js'
import dbHelper from './dbHelper.js'


const Player = {
    /**
     * @param {string} uname - new player's username
     */
    joinGame: function(uname, shortName){
        return new Promise(async (resolve, reject) => {
            const gameStarted = await dbHelper.getGameStarted()
            if (gameStarted){
                reject('004')
                return
            }

            dbHelper.getPlayers().then(players => {
                let alreadyJoined = false
                players.forEach( p => {
                    if (p.username === uname || p.shortName === shortName)
                        alreadyJoined = true
                })
                if (alreadyJoined){
                    reject('012')
                    return
                }

                dbHelper.createPlayer(uname, shortName).then(player => resolve(player))
            })
        })
    },

    /**
     * move - move player in cardinal direction by one
     * @param {string} uname - username of player doing the action
     * @param {string} dir - cardinal direction i.e 'S' or 'NW'
     */
    move: async function(uname, dir){
        const NUM_COLS = await dbHelper.getGameSetting('num_cols')
        const NUM_ROWS = await dbHelper.getGameSetting('num_rows')
        let player = await dbHelper.getPlayer(uname)

        return new Promise((resolve, reject) => {
            if (player.actionTokens === 0){
                reject('003')
            }

            // parse string
            dir = dir.toUpperCase()
            if (!Utils.DIRECTIONS.includes(dir)){
                reject('002')
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
            if (player.position.r < 0 || player.position.r > NUM_ROWS-1 || player.position.c < 0 || player.position.c > NUM_COLS-1){
                reject('001')
            }
            
            // check ran into other players
            dbHelper.getPlayerPositions()
                .then(playersPos => {
                    let ranIntoPlayer = false
                    playersPos.forEach(playerPos => {
                        let pos = playerPos.position
                        if (playerPos.username === player.username){
                            return
                        } else if (pos.r === player.position.r && pos.c === player.position.c){
                            ranIntoPlayer = true
                            return
                        }
                    })
                    if (ranIntoPlayer){
                        reject('008')
                    }

                    player.actionTokens--
                    dbHelper.updatePlayer(uname, {
                        actionTokens: player.actionTokens,
                        position: { ...player.position }
                    })
                    .then(response => resolve(response))
                    .catch(err => reject(err) )
                })
                .catch(err => {
                    reject(err)
                })
        })
    },

    /**
     * shoot - player shoots at coordinate on board
     * @param {string} uname - username of player doing the action
     * @param {string} coords - 2-character coords being aimed at; i.e 'a3' or 'H7'
     * @param {boolean} isShooting - is player shooting or gifting an action point
     */
    //////// need to update for database /////////////////////////////////
    shoot: async function(uname, coords, isShooting = true, numTokens){
        let player = await dbHelper.getPlayer(uname)
        let { range, position, actionTokens } = player
        let { r, c } = position

        return new Promise(async (resolve, reject) => {
            if (actionTokens < 1){
                reject('003')
            }
            if (!coords){
                reject('009')
            }
    
            // parse coordinates
            coords = coords ? coords.toUpperCase() : ""
            let splitCoords = coords.split('')
            
            // check valid coordinates
            let row = Utils.ROW_NAMES.findIndex((name, i) => {
                return name === splitCoords[0]
            })
            if (splitCoords.length > 2 || row === -1 || splitCoords[1].match(/\d/) === null){
                reject('009')
            }
            let col = parseInt(splitCoords[1])
    
            // check sufficient range
            if (Math.abs(row - r) > range || Math.abs(col - c) > range){
                reject('010')
            }
    
            // check player at coordinates
            let playerPositions = await dbHelper.getPlayers()
            let hitPlayer = null
            playerPositions.forEach(pos => {
                if (!pos.isDead && pos.position.r === row && pos.position.c === col){
                    hitPlayer = pos
                }
            })
            if (hitPlayer === null){
                reject('011')
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
    
            // remove action token
    
            dbHelper.updatePlayer(uname, player)
                .then(res => {
                    dbHelper.updatePlayer(hitPlayer.username, hitPlayer)
                        .then(hitRes => resolve({
                            player,
                            hitPlayer
                        }))
                        .catch(hitErr => reject(hitErr))
                })
                .catch(err => reject(err))
        })
    },

    /**
     * giftActionToken - gift another player an action token
     * @param {string} uname - username of player giving the token
     * @param {string} coords - 2-character coords being aimed at; i.e 'a3' or 'H7'
     */
    giftActionToken: function(uname, coords, numTokens = 1){
        return this.shoot(uname, coords, false, parseInt(numTokens))
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
            (isDead ? Utils.getDeathMessage() + "\n" : `${health} hp,  ${range} range,  ${actionTokens} tokens\n`)
        }
    },

    /**
     * printPlayers - prints info of multiple players
     * @param  {...string} unames - array of player names to print; if empty, will print all players
     */
    printPlayers: function(players){
        return players.map( p => this.printInfo(p) ).join("")
    }
}

export default Player

