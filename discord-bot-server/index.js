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
const   db = new Database()
        game = new Game(db),
        player = new Player(db)


function parseCommand(msg){
    let string = msg.content
    let split = string.split(' ')
    let command = split.shift().toLowerCase()

    switch(command){
        // Admin
        case "$give-tokens":
            msg.reply("giving daily tokens")
            game.giveDailyTokens()
            break;
        case "$start-game":
            game.startGame()
            msg.reply(
                game.printBoard()
            )
            break;
        case "$reset-game":
            msg.reply("reseting game")
            game.resetGame()
            break;
        case "$get-game-data":
            console.log(db.getPlayers())
            console.log(db.getVotes())
            console.log(`gameStarted: ${db.getGameStarted()}`)
            break;

        // Players
        case "$join":
            msg.reply(`player ${msg.author.username} is joining the game`)
            player.join(msg.author.username)
            break;
        case "$move":
            let result = player.move(username, ...split)
            if (Utils.catchError(result)){
                return result
            }
            msg.reply( game.printBoard() )
            break;
        case "$shoot":
            // player.shoot(username, ...split)
            msg.reply(`player ${msg.author.username} is shooting ${split.join(' ')}`)
            break;
        case "$upgrade-range":
            // player.upgradeRange(username)
            msg.reply(`upgrading ${msg.author.username}'s range'`)
            break;
        case "$gift-action-token":
            // player.giftActionToken(username, ...split)
            msg.reply(`player ${msg.author.username} gifting token to ${split.join(' ')}`)
            break;
        case "$vote":
            // player.vote(username, ...split)
            msg.reply(`player ${msg.author.username} is voting for ${split.join(' ')}`)
            msg.author.send('You can start dming me now')
            break;
        default:
            msg.reply("No such command found.")
            msg.delete()
            break;
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
        if (msg.content.match(/^\$.*/)){ // starts with $
            let res = parseCommand(msg)
            if (Utils.catchError(res)){
                msg.reply(res)
            }
        }

        if (msg.content === "ping"){
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

/*

deraj21
$move
$gift-action-token c5$
$shoot 7 f9
what is this game?
Who is having fun?!
$command-this-is-not
$neither-me


*/