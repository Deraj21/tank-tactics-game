// node modules
import dotenv from 'dotenv'
import Discord from "discord.js"
import Database from "@replit/database"
const db = new Database()

// my modules
import Game from "./Classes/Game.js"
import Player from "./Classes/Player.js"
import Error from "./Classes/ErrorCodes.js"
import Utilities from "./Classes/Utilities.js"
import dbHelper from "./Classes/dbHelper.js"

// setup
dotenv.config()
const { catchError } = Utilities
const { Intents, Client } = Discord
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });
const DISCORD_TOKEN = process.env['DISCORD_TOKEN']
const ADMIN_UNAME = process.env['ADMIN_UNAME']
const GM_ROLE = "GameMaster"


// db.list().then(keys => {
    
//     keys.forEach(key => {
//         db.get(key).then(value => console.log({key, value}))
//     })
// })


// await Game.startGame()
// console.log('game started')
// const board = await Game.printBoard()
// console.log(board)

// await dbHelper.setDummyData()
console.log('first')
dbHelper.getPlayers().then(players => {
    console.log('hi', players)
    // console.log(
    //     players.map(p => {
    //         return `${p.username}: (${p.position.r}, ${p.position.c})`
    //     })
    // )
})


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
                let votes = await dbHelper.getVotes()
                msg.reply( Game.printVotes(votes) )
                await Game.giveDailyTokens(...split)
                playersUpdated = true
                break;
            case "!start-game":
            case "!start":
                Game.startGame()
                boardUpdated = true;
    
                break;
            case "!reset-game":
            case "!reset":
                msg.reply("game has been reset. players can join until the game starts")
                Game.resetGame()
                break;
            case "!get-players": // for debugging
                playersUpdated = true
                break;
            case "!get-votes":
                console.log("getting votes")
                msg.reply( Game.printVotes() )
                break;
            case "!clear-channel":
                msg.reply("Deleting stuff...")
                // console.log(
                //     msg.channel
                // )
                break;
            case "!smile":
                Game.postBoard(msg);
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
                shortName = msg.author.username.split('').splice(0, 3).join('')
            } else if (split[0].length < 3) {
                shortName = split[0] + ".".repeat(3 - split[0].length)
            } else if (split[0].length > 3){
                shortName = split[0].split('').splice(0, 3).join('')
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
        default:
            if (invalidCommand){
                msg.reply("`" + msg.content + "` is not a valid command.")
                    .then(res => {
                        console.log(msg)
                        // msg.delete()
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            break;
    }

    if (boardUpdated){
        game.postBoard(msg)
    } else if (playersUpdated){
        msg.reply( Player.printPlayers() )
    }
}

/////////
// EVENTS
// client.on('ready', () => {
//     console.log(`Logged in as ${client.user.tag}!`)
// })

// client.on('messageCreate', msg => {
//     if (msg.author.bot) return;
    
//     if (msg.channel.name === "call-out-moves") {
//         if (msg.content.match(/^\!.*/)){ // starts with !
//             let res = parseCommand(msg)
//             if (catchError(res)){
//                 msg.reply(Error[res])
//             }
//         }
//         if (msg.content === "!ping"){
//             msg.reply("pong")
//         }
//     } else if (msg.channel.type === "DM") {
//         msg.author.send("You are DMing me now!")
//     }

// })


// // Bot log in
// client.login(DISCORD_TOKEN)
//     .then(res => {
//         console.log(res)
//     })
//     .catch(err => {
//         console.log(err)
//     })

