// node modules
import dotenv from 'dotenv'
dotenv.config()
import Discord from "discord.js"
import Database from "@replit/database"
const db = new Database(process.env.REPLIT_DB_URL)

// my modules
import Game from "./Classes/Game.js"
import Player from "./Classes/Player.js"
import Error from "./Classes/ErrorCodes.js"
import Utilities from "./Classes/Utilities.js"
import dbHelper from "./Classes/dbHelper.js"

// setup
const { catchError, shortNameLength } = Utilities
const { Intents, Client } = Discord
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });
const DISCORD_TOKEN = process.env['DISCORD_TOKEN']
const ADMIN_UNAME = process.env['ADMIN_UNAME']
const GM_ROLE = "GameMaster"



async function parseCommand(msg){
    let split = msg.content.split(' ')
    let command = split.shift().toLowerCase()
    let boardUpdated = false
    let playersUpdated = false
    let invalidCommand = false
    let isGM = msg.member.roles.cache.some(role => role.name === GM_ROLE)
    let result = ''

    if (isGM){
        // Admin
        switch(command){
            case "!daily-tokens":
            case "!dt":
                let votes = await dbHelper.getVotes()
                msg.reply( Game.printVotes(votes) )
                let result = await Game.giveDailyTokens(...split)
                
                msg.reply( Player.printPlayers(result) )
                break;
            case "!start-game":
            case "!start":
                Game.startGame()
                .then(res => {
                    console.log(res)
                    Game.postBoard(msg)
                })
                .catch(err => {
                    console.log(err)
                    msg.reply(err)
                })
                
                
                break;
            case "!reset-game":
            case "!reset":
                msg.reply("Game has been reset. Players can join until the game starts")
                Game.resetGame()
                break;
            case "!add-test-data":
            case "!test-data":
                dbHelper.setDummyData()
                    .then(res => {
                        msg.reply('test data set')
                    })
                    .catch(err => {
                        msg.reply('test data failed')
                        console.log(err)
                    })
                break;
            case "!get-players":
                playersUpdated = true
                break;
            case "!get-votes":
                ///////// TESTING //////////////////////////////////
                console.log("getting votes")
                msg.reply( Game.printVotes() )
                break;
            case "!clear-channel":
                msg.reply("Deleting stuff...")
                // console.log(
                //     msg.channel
                // )
                break;
            case "!get-board":
                Game.postBoard(msg);
                break;
            case "!debug":

                break;
            default:
                invalidCommand = true
                break;
        }
    }

    // Players
    switch(command){
        case "!join":
        case "!j":
            // get shortName
            let shortName = ""
            if (split[0] === undefined || split[0] === ""){
                shortName = msg.author.username.split('').splice(0, shortNameLength).join('')
            } else if (split[0].length < shortNameLength) {
                shortName = split[0] + ".".repeat(shortNameLength - split[0].length)
            } else if (split[0].length > shortNameLength){
                shortName = split[0].split('').splice(0, shortNameLength).join('')
            } else {
                shortName = split[0]
            }

            return Player.joinGame(msg.author.username, shortName)
                .then(res => {
                    msg.reply(`"${msg.author.username}" (${shortName}) joined the game`)
                })
                .catch(errorCode => {
                    return errorCode
                })
            break;
        case "!move":
        case "!m":
            result = Player.move(msg.author.username, ...split)
            if (catchError(result)){
                return result
            }
            boardUpdated = true
            
            break;
        case "!shoot":
        case "!s":
            result = Player.shoot(msg.author.username, split[0])
            if (catchError(result)){
                return result
            }
            boardUpdated = true
            break;
        case "!upgrade-range":
        case "!ur":
            result = Player.upgradeRange(msg.author.username)
            if (catchError(result)){
                return result
            }
            boardUpdated = true
            break;
        case "!gift-token":
        case "!gt":
            result = Player.giftActionToken(msg.author.username, ...split)
            if (catchError(result)){
                return result
            }
            boardUpdated = true
            break;
        case "!vote":
        case "!v":
            result = Player.vote(msg.author.username, ...split)
            msg.reply(`player ${msg.author.username} is voting for ${split.join(' ')}`)
            msg.author.send('You can start dming me now')
            break;
        case "!ping":
            msg.reply("pong!")
            break;
        default:
            if (invalidCommand){
                msg.reply("`" + msg.content + "` is not a valid command.")
                    .then(res => {
                        // console.log(msg)
                        // msg.delete()
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            break;
    }

    if (boardUpdated){
        Game.postBoard(msg)
    } else if (playersUpdated){
        const playersData = await dbHelper.getPlayers()
        if (playersData.length){
            msg.reply( Player.printPlayers(playersData) )
        } else {
            console.log(Error['014'])
            msg.reply(Error['014'])
        }
    }
}

/////////
// EVENTS
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('messageCreate', msg => {
    if (msg.author.bot) return;
    
    if (msg.channel.name === "call-out-moves") {
        if (msg.content.match(/^\!.*/)){ // starts with !
            let res = parseCommand(msg)
            if (catchError(res)){
                msg.reply(Error[res])
            }
        }
    } else if (msg.channel.type === "DM") {
        msg.author.send("You are DMing me now!")
    }

})


// Bot log in
client.login(DISCORD_TOKEN)
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
