// node modules
import dotenv from 'dotenv'
dotenv.config()
import Discord from "discord.js"
import Database from "@replit/database"
const db = new Database(process.env.REPLIT_DB_URL)

// my modules
import Game from "./Classes/Game.js"
import Player from "./Classes/Player.js"
import Utilities from "./Classes/Utilities.js"
import dbHelper from "./Classes/dbHelper.js"
import Error from './Classes/ErrorCodes.js'

// setup
const { catchError, shortNameLength } = Utilities
const { Intents, Client } = Discord
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });
const DISCORD_TOKEN = process.env['DISCORD_TOKEN']
const ADMIN_UNAME = process.env['ADMIN_UNAME']
const GM_ROLE = "GameMaster"
let votes

// dbHelper.updatePlayers([])
// dbHelper.updateVotes({})
// dbHelper.getAll()


async function parseCommand(msg){
    let split = msg.content.split(' ')
    let command = split.shift().toLowerCase()
    let isGM = msg.member.roles.cache.some(role => role.name === GM_ROLE)

    let invalidCommand = false
    let boardUpdated = false
    let settingsUpdated = false
    let playersUpdated = false
    let printPlayers = false
    let printVotes = ''
    let result = ''

    let players = await dbHelper.getPlayers()
    let settings = await dbHelper.getGameSettings()
    let votes = await dbHelper.getVotes()
    let gameStarted = await dbHelper.getGameStarted()
    let gameStartedUpdated = false

    if (isGM){
        // Admin
        switch(command){
            case "!daily-tokens":
            case "!dt":
                printVotes = Game.printVotes(votes)
                result = Game.giveDailyTokens(players, votes, settings)
                boardUpdated = true
                playersUpdated = true
                break;
            case "!start-game":
            case "!start":
                if (gameStarted){
                    msg.reply(Error['013'])
                } else {
                    Game.randomizePlayerPositions(players, settings)
                    gameStarted = true
                    gameStartedUpdated = true
                    playersUpdated = true
                    boardUpdated = true
                }
                break;
            case "!reset-game":
            case "!reset":
                /////////// Need to convert! /////////////
                msg.reply("Game has been reset. Players can join until the game starts")
                gameStarted = false
                gameStartedUpdated = true
                break;
            case "!add-test-data":
            case "!test-data":
                if (!gameStarted){
                    players = [ ...players, ...dbHelper.getDummyData() ]
                    playersUpdated = true
                } else {
                    msg.reply()
                }

                    // .then(res => {
                    //     msg.reply('test data set')
                    // })
                    // .catch(err => {
                    //     msg.reply('test data failed')
                    //     console.log(err)
                    // })
                break;
            case "!get-players":
                resolve({ playersUpdated: true })
                break;
            case "!get-votes":
                votes = await dbHelper.getVotes()
                msg.reply( Game.printVotes(votes) )
                break;
            case "!clear-channel": // post-mvp
                // msg.reply("Deleting stuff...")
                break;
            case "!get-board":
            case "!gb":
                // Game.postBoard(msg);
                resolve({boardUpdated: true})
                break;
            case "!game-setting":
                dbHelper.setGameSetting(...split)
                    .then(res => {
                        msg.reply(`${split[0]} has been set to ${split[1]}`)
                    })
                    .catch(err => console.log(err))
                break;
            case "!get-settings":
                dbHelper.getGameSettings()
                    .then(settings => {
                        msg.reply( Game.printSettings(settings) )
                    })
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

            Player.joinGame(msg.author.username, shortName)
                .then(res => {
                    msg.reply(`"${msg.author.username}" (${shortName}) joined the game`)
                })
                .catch(code => {
                    msg.reply( Error[code] )
                })
            break;
        case "!move":
        case "!m":
            Player.move(msg.author.username, ...split)
                .then(response => {
                    resolve({ boardUpdated: true })
                })
                .catch(code => {
                    msg.reply(Error[code])
                })
            
            break;
        case "!shoot":
        case "!s":
            Player.shoot(msg.author.username, split[0])
                .then(res => {
                    msg.reply(`${res.player.shortName} shot ${res.hitPlayer.shortName}`)
                    resolve({boardUpdated: true})
                })
                .catch(code => {
                    msg.reply(Error[code])
                })
            break;
        case "!gift-token":
        case "!gt":
            Player.giftActionToken(msg.author.username, ...split)
                .then(res => {
                    msg.reply(`${res.player.shortName} gifted a token to ${res.hitPlayer.shortName}`)
                })
                .catch(err => {
                    
                })
            boardUpdated = true
            break;
        case "!vote":
        case "!v":
            /// NEED TO TEST //////////////////////
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

    let promises = []

    // update and reply
    if (boardUpdated){
        Game.postBoard(msg, players, settings)
    }
    if (playersUpdated){
        dbHelper.updatePlayers(players)
    }
    if (printPlayers){
        msg.reply(Player.printPlayers(players))
    }
    if (printVotes !== ''){
        msg.reply( printVotes )
    }
    if (settingsUpdated){
        dbHelper.updateGameSettings(settings)
    }
    if (gameStartedUpdated){
        dbHelper.setGameStarted(gameStarted)
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
            parseCommand(msg)
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

