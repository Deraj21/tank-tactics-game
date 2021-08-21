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
    let split = msg.content.split(' ')
    let command = split.shift().toLowerCase()
    let boardUpdated = false

    switch(command){
        // Admin
        case "$give-tokens":
            game.giveDailyTokens()
            msg.reply("daily tokens given out")
            // TODO: show vote tally (not who voted but whom recieved the votes)
            break;
        case "$start-game":
            game.startGame()
            boardUpdated = true;

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
            player.join(msg.author.username)
            msg.reply(`player "${msg.author.username}" added the game`)
            break;
        case "$move":
            let result = player.move(username, ...split)
            if (Utils.catchError(result)){
                return result
            }
            boardUpdated = true
            
            break;
        case "$shoot":
            // player.shoot(username, ...split)
            boardUpdated = true
            break;
        case "$upgrade-range":
            // player.upgradeRange(username)
            boardUpdated = true
            break;
        case "$gift-action-token":
            // player.giftActionToken(username, ...split)
            boardUpdated = true
            break;
        case "$vote":
            // player.vote(username, ...split)
            msg.reply(`player ${msg.author.username} is voting for ${split.join(' ')}`)
            msg.author.send('You can start dming me now')
            break;
        default:
            msg.reply("`" + msg.content + "` is not a valid command.")
                .then(res => {
                    console.log(res)
                    // msg.delete()
                })
                .catch(err => {
                    console.log(err)
                })
            break;
    }

    if (boardUpdated){
        msg.reply( game.printBoard() )
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