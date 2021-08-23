// node modules
require('dotenv').config()
const Discord = require("discord.js")

// my modules
const Game = require("./Classes/Game.js")
const Player = require("./Classes/Player.js")
const Error = require("./Classes/ErrorCodes.js")
const Utils = require("./Classes/Utilities.js")
const Database = require("./Classes/Database.js")

// setup data
const { Intents, Client } = Discord
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });
const DISCORD_TOKEN = process.env['DISCORD_TOKEN']
const ADMIN_UNAME = process.env['ADMIN_UNAME']
const GM_ROLE = "GameMaster"
const   db = new Database()
        game = new Game(db),
        player = new Player(db)


function parseCommand(msg){
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
                game.giveDailyTokens(...split)
                msg.reply("daily tokens have been given out")
                playersUpdated = true
                // TODO: show vote tally (not who voted but whom recieved the votes)
                break;
            case "!start-game":
            case "!start":
                game.startGame()
                boardUpdated = true;
    
                break;
            case "!reset-game":
            case "!reset":
                msg.reply("game has been reset. players can join until the game starts")
                game.resetGame()
                break;
            case "!get-game-data": // for debugging
                console.log(db.getPlayers())
                console.log(db.getVotes())
                console.log(`gameStarted: ${db.getGameStarted()}`)
                break;
            case "!clear-channel":
                msg.reply("Deleting stuff...")
                
                console.log(
                    msg.channel
                )

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

            player.join(msg.author.username, shortName)
            msg.reply(`"${msg.author.username}" (${shortName}) joined the game`)
            break;
        case "!move":
        case "!m":
            result = player.move(msg.author.username, ...split)
            if (Utils.catchError(result)){
                return result
            }
            boardUpdated = true
            
            break;
        case "!shoot":
        case "!s":
            result = player.shoot(msg.author.username, split[0])
            if (Utils.catchError(result)){
                return result
            }
            boardUpdated = true
            break;
        case "!upgrade-range":
        case "!ur":
            result = player.upgradeRange(msg.author.username)
            if (Utils.catchError(result)){
                return result
            }
            boardUpdated = true
            break;
        case "!gift-token":
        case "!gt":
            result = player.giftActionToken(msg.author.username, ...split)
            if (Utils.catchError(result)){
                return result
            }
            boardUpdated = true
            break;
        case "!vote":
        case "!v":
            result = player.vote(msg.author.username, ...split)
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
        msg.reply(
            "```\n" + game.printBoard(false) + "```\n" +
            player.printPlayers()
        )
    } else if (playersUpdated){
        msg.reply( player.printPlayers() )
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
            if (Utils.catchError(res)){
                msg.reply(Error[res])
            }
        }

        if (msg.content === "!ping"){
            msg.reply("pong")
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

