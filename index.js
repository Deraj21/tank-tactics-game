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

dbHelper.getGameSettings()
    .then(settings => console.log(settings))

async function parseCommand(msg){
    let args = msg.content.split(' ')
    let command = args.shift().toLowerCase()
    let isGM = msg.member.roles.cache.some(role => role.name === GM_ROLE)

    let invalidCommand = false
    let boardUpdated = false
    let playersUpdated = false
    let votesUpdated = false
    let settingsUpdated = false
    let gameStartedUpdated = false
    let printPlayers = false
    let printSettings = false
    let printVotes = ''
    let result = null

    let notYetJoined = false
    let playerIsDead = false

    let players = await dbHelper.getPlayers()
    let settings = await dbHelper.getGameSettings()
    let votes = await dbHelper.getVotes()
    let gameStarted = await dbHelper.getGameStarted()

    if (isGM){
        // Admin
        switch(command){
            case "!daily-tokens":
            case "!dt":
                if (!gameStarted){
                    msg.reply( Error['024'] )
                    break;
                }
                printVotes = Game.printVotes({ ...votes })
                result = Game.giveDailyTokens(players, votes, settings)
                
                if (catchError(result)){
                    // ?
                } else {
                    boardUpdated = true
                    playersUpdated = true
                    votesUpdated = true
                    votes = {} // 'forget' votes
                    msg.reply(`${msg.author.username} has given out tokens!`)
                }

                break;
            case "!start-game":
            case "!start":
                if (gameStarted){
                    msg.reply(Error['013'])
                } else {
                    Game.setupGame(players, settings)
                    gameStarted = true
                    gameStartedUpdated = true
                    playersUpdated = true
                    boardUpdated = true
                }
                break;
            case "!reset-game":
            case "!reset":
                dbHelper.resetGame()
                msg.reply("Game has been reset. Players can join until the game starts")
                break;
            case "!get-players":
                printPlayers = true
                break;
            case "!get-votes":
                printVotes = Game.printVotes(votes)
                break;
            case "!get-board":
            case "!gb":
                if (!gameStarted){
                    msg.reply(Error['017'])
                } else {
                    boardUpdated = true
                }
                break;
            case "!change-setting":
            case "!cs":
                if (gameStarted){
                    msg.reply(Error['018'])
                } else {
                    let settingName = args[0]
                    let settingValue = args[1]
                    // need to check if setting exists & validate it is the same type

                    result = Game.setGameSetting(settingName, settingValue, settings)
                    if (catchError(result)){
                        msg.reply(Error[result])
                    } else {
                        settingsUpdated = true
                        msg.reply(`${settingName} has been set to ${result}`) 
                    }
                }
                break;
            case "!get-settings":
                printSettings = true
                break;
            case "!ping":
                msg.reply("pong!")
                break;
            case "!add-test-data":
            case "!test-data":
                if (!gameStarted){
                    players = [ ...players, ...dbHelper.getDummyData() ]
                    playersUpdated = true
                    msg.reply('test data set:\n' + Player.printPlayers(players))
                } else {
                    msg.reply(Error['015'])
                }
                break;
            case "!clear-channel": // post-mvp
                break;
            default:
                invalidCommand = true
                break;
        }
    }
    
    // if 'non-players' (haven't used !join)
    let index = players.findIndex(p => p.username == msg.author.username)
    if (index === -1){
        notYetJoined = true
    } else {
        playerIsDead = players[index].isDead
    }

    // Players
    switch(command){
        case "!join":
        case "!j":
            if (gameStarted){
                result = '004'
            } else {
                result = Player.joinGame(msg.author.username, args[0], players)
            }
            
            if (catchError(result)){
                msg.reply(Error[result])
            } else {
                playersUpdated = true
                msg.reply(`**${result}** (${msg.author.username}) joined the game`)
            }

            break;
        case "!move":
        case "!m":
            if (notYetJoined){
                msg.reply(Error['023'])
                return
            }
            if (!gameStarted){
                msg.reply(Error['017'])
                return
            }
            if(playerIsDead){
                msg.reply(Error['025'])
                return
            }
            result = Player.move(msg.author.username, args[0], players, settings)
            if (result){
                msg.reply(Error[result])
            } else {
                boardUpdated = true
                playersUpdated = true
            }
            
            break;
        case "!shoot":
        case "!s":
            if (notYetJoined){
                msg.reply(Error['023'])
                return
            }
            if (!gameStarted){
                msg.reply(Error['017'])
                return
            }
            if(playerIsDead){
                msg.reply(Error['025'])
                return
            }
            result = Player.shoot(msg.author.username, args[0], players, settings)

            if (catchError(result)){
                msg.reply(Error[result])
            } else {
                msg.reply(
                    `${result.player} shot ${result.hitPlayer}${result.dead ? ' dead' : ''}`
                )
                boardUpdated = true
                playersUpdated = true
            }
            break;
        case "!gift-token":
        case "!gt":
            if (notYetJoined){
                msg.reply(Error['023'])
                return
            }
            if (!gameStarted){
                msg.reply(Error['017'])
                return
            }
            if(playerIsDead){
                msg.reply(Error['025'])
                return
            }
            result = Player.giftActionToken(msg.author.username, players, settings, ...args)

            if (catchError(result)){
                msg.reply(Error[result])
            } else {
                msg.reply(`${result.player} gifted token(s) to ${result.hitPlayer}`)
                boardUpdated = true
                playersUpdated = true
            }
            break;
        case "!vote":
        case "!v":
            if (notYetJoined){
                msg.reply(Error['023'])
                return
            }
            if (!gameStarted){
                msg.reply(Error['017'])
                return
            }
            result = Player.vote(msg.author.username, args[0], players, votes)
            
            if (catchError(result)){
                msg.reply(Error[result])
            } else {
                msg.reply(`player **${result}** voted for **${args.join(' ')}**`)
                votesUpdated = true

                // msg.author.send('You can start DMing me now')
                // TODO: figure out how to do private voting
            }

            break;
        default:
            if (invalidCommand || !isGM){
                msg.reply("`" + msg.content + "` is not a valid command.")
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
    if (votesUpdated){
        dbHelper.updateVotes(votes)
    }
    if (printPlayers){
        msg.reply(Player.printPlayers(players))
    }
    if (printVotes !== ''){
        msg.reply( printVotes )
    }
    if (printSettings){
        msg.reply(Game.printSettings(settings))
    }
    if (settingsUpdated){
        dbHelper.updateGameSettings(settings)
    }
    if (gameStartedUpdated){
        dbHelper.setGameStarted(gameStarted)
    }

}

// /////////
// // EVENTS
// client.on('ready', () => {
//     console.log(`Logged in as ${client.user.tag}!`)
// })

// client.on('messageCreate', msg => {
//     // console.log("channel type: ", msg.channel.type)

//     if (msg.author.bot) return;
    
//     if (msg.channel.name === "call-out-moves") {
//         if (msg.content.match(/^\!.*/)){ // starts with !
//             parseCommand(msg)
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

