import Utils from './Utilities.js'
import dbHelper from './dbHelper.js'
import Error from './ErrorCodes.js'
import jsdom from 'jsdom'
import sharp from 'sharp'
import { MessageAttachment, MessagePayload, SnowflakeUtil } from 'discord.js'

import { select, scaleLinear, axisTop, axisLeft, arc } from 'd3'
const { hashRGB, H, W, margin, innerW, innerH, fontSize, ROW_NAMES } = Utils

// const { select } = d3
const { JSDOM } = jsdom

/**
 * Game
 */
const Game = {
    startGame: async function(){
        return new Promise(async (resolve, reject) => {
            const gameHasStarted = await dbHelper.getGameStarted()
            if (gameHasStarted){
                reject(Error['013'])
            }
    
            dbHelper.setGameStarted(true).then(res => {
                this.randomizePlayerPositions().then(posRes => {
                    resolve(posRes)
                })
            })
            .catch(err => {reject(err)})
        })
    },
    resetGame: function(){
        dbHelper.resetGame()
    },
    randomizePlayerPositions: async function(){
        return new Promise(async (resolve, reject) => {
            // create flat array of all coordinates
            const NUM_ROWS = await dbHelper.getGameSetting('num_rows')
            const NUM_COLS = await dbHelper.getGameSetting('num_cols')
            let coords = []
            for (let r = 0; r < NUM_ROWS; r++){
                for (let c = 0; c < NUM_COLS; c++){
                    coords.push(r + '-' + c)
                }
            }
    
            // get players
            dbHelper.getPlayers().then(players => {
                players.forEach(async (player, i) => {
                    // for each player, splice coordinate from the list
                    let coordinates = Utils.randomFromList(coords).split('-')
                    player.position.r = parseInt(coordinates[0])
                    player.position.c = parseInt(coordinates[1])
    
                    await dbHelper.updatePlayer(player.username, player)
    
                    if (i === players.length - 1){
                        resolve(players)
                    }
                })
            })
        })
    },
    giveDailyTokens: function(){
        return new Promise(async (resolve, reject) => {
            let numTokens = await dbHelper.getGameSetting('daily_token_count')
            let votes = await dbHelper.getVotes()

            let tally = {}
            for (let key in votes){
                if (tally[votes[key]]){
                    tally[votes[key]]++
                } else {
                    tally[votes[key]] = 1
                }
            }
            
            let players = await dbHelper.getPlayers()
            players.forEach(async player => {
                if (!player.isDead){
                    player.actionTokens += parseInt(numTokens)
                    if (tally[player.username] >= 3){
                        player.actionTokens += parsInt(numTokens)
                    }
                    await dbHelper.updatePlayer(player.username, { actionTokens: player.actionTokens })
                }
            })

            // 'forget' votes
            await dbHelper.emptyVotes()
            resolve(players)
        })


    },
    printVotes: function(votes){
        let tally = {}
        for (let key in votes){
            if (tally[votes[key]]){
                tally[votes[key]]++
            } else {
                tally[votes[key]] = 1
            }
        }

        let text = "Vote Tallies:\n"
        for (let key in tally){
            text += `${key}: ${tally[key]}\n`
        }

        return text
    },
    printBoard: async function(small = false){
        // create board
        const NUM_ROWS = await dbHelper.getGameSetting('num_rows')
        const NUM_COLS = await dbHelper.getGameSetting('num_cols')
        const players = await dbHelper.getPlayers()

        let board = []
        let healths = {}
        for (let r = 0; r < NUM_ROWS; r++){
            let row = []
            for (let c = 0; c < NUM_COLS; c++){
                row.push(small ? '.' : '   ')
            }

            board.push(row)
        }
        // place 'tanks'
        players.forEach(p => {
            if (p.isDead){
                return
            }

            let { r, c } = p.position
            board[r][c] = small ? p.name[0] : p.shortName
            if (!small) {
                healths[p.shortName] = p.health
            }
        })

        // column labels
        let text = small ? ' ' : ' '
        for (let i = 0; i < NUM_COLS; i++){
            text += small ? ` ${i}` : `   ${i}`
        }
        text += '\n'
        if (!small){
            text += "  " + " _ _".repeat(NUM_COLS) + "\n"
        }

        // rows
        board.forEach((row, r) => {
            // text += ''
            text += ROW_NAMES[r] + ' '
            if (small){
                text += row.join(' ') + '\n'
            } else {
                text += '|' + row.join('|') + "|\n"
                text += "  |"
                row.forEach(c => {
                    text += "_" + (healths[c] ? healths[c] : " ") + "_|"
                })
                text += "\n"
            }
        })

        return text
    },

    /**
     * @param {Message} - discordMsg
     */
    postBoard: async function(discordMsg){
        const NUM_ROWS = await dbHelper.getGameSetting('num_rows')
        const NUM_COLS = await dbHelper.getGameSetting('num_cols')
        const players = await dbHelper.getPlayers()
        const dom = new JSDOM('<!DOCTYPE html><body></body>')

        // svg
        const body = select(dom.window.document.querySelector('body'))
        const svg = body.append('svg')
            .attr('height', H)
            .attr('width', W)
        svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "white");

        // scales
        const xScale = scaleLinear()
            .domain([0, NUM_ROWS])
            .range([0, innerW])

        const yScale = scaleLinear()
            .domain([0, NUM_COLS])
            .range([0, innerH])
            .nice()

        // axis
        const xAxis = axisTop(xScale)
            .tickSize(-innerH)
            .tickPadding(10)
            // .tickFormat(format(''))
        const yAxis = axisLeft(yScale)
            .tickSize(-innerW)
            .tickPadding(5)
            .tickFormat(n => ROW_NAMES[n])

        let g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)

        // yAxis
        const yAxisG = g.append('g').call(yAxis)
        yAxisG.selectAll('text')
            .attr('font-size', fontSize)
            .attr('transform', `translate(0,${innerH / NUM_ROWS / 2})`)

        // xAxis
        const xAxisG = g.append('g').call(xAxis)
        xAxisG.selectAll('text')
            .attr('font-size', fontSize)
            .attr('transform', `translate(${innerW / NUM_COLS / 2},0)`)

        // players (tanks)
        players.forEach(player => {
            this.appendPlayer(player, g, NUM_COLS, NUM_ROWS)
        })

        const svgString = body.html()
        const fileName = 'tank-tactics-board.png'
        
        // create file and post
        let svgBuffer = Buffer.from(svgString, 'utf-8')
        let svgSharp = sharp(svgBuffer)
            .toFormat('png')
            .toBuffer()
            .then(data => {
                // console.log(data)
                // const attachmentFromBuffer = new MessageAttachment(data, {
                //     id: SnowflakeUtil.generate(),
                //     filename: fileName,
                //     description: 'Tank Tactics Board Update',
                //     media_type: 'image'
                // })

                discordMsg.channel.send({ files: [ data ] })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log("sharp image failed:", err)
            })


    },
    appendPlayer: async function(data, g, NUM_COLS, NUM_ROWS){
        const   w = innerW / NUM_COLS,
                h = innerH / NUM_ROWS

        const { username, shortName, health, actionTokens, range, position, color, isDead } = data
        const textMargin = H / 200,
            heartH = h / 2.5,
            tokenW = w / 6
        let addZero = n => n = n < 10 ? '0'+n : ""+n

        let player = g.append('g')
            .attr('transform', `translate(${position.r * w-1},${position.c * h-1})`)
        
        let tank = player.append('rect')
            .attr('fill', color)
            .attr('stroke', 'black')
            .attr('height', h)
            .attr('width', w)

        let heart = player.append('g')
            .attr('transform', `translate(${w/2},${fontSize + 2*textMargin + 3})`)
        heart.append('path')
            .attr('d', `M0,${heartH} A1,2 140 0 1 0,0 A1,2 40 0 1 0,${heartH}`)
            .attr('fill', 'red')

        let arcPath = arc()
            .innerRadius(0)
            .outerRadius(w/2 - textMargin)
            .startAngle(0)
            .endAngle(Math.PI*2 * (1 - health / 3));
        heart.append('path')
            .attr('transform', `translate(${textMargin-3},${fontSize + textMargin-5})`)
            .attr('d', arcPath)
            .attr('fill', color)

        // name
        let nameElm = player.append('text')
            .text(shortName)
            .attr('transform', `translate(${textMargin},${fontSize + textMargin})`)
            .attr('font-size', fontSize)

        let tokensCounter = player.append('g')
            .attr('transform', `translate(${w-tokenW-textMargin},${h-tokenW-textMargin})`)
        tokensCounter.append('circle')
            .attr('r', tokenW)
            .attr('fill', 'springgreen')
            .attr('stroke', 'black')
        tokensCounter.append('text')
            .text(addZero(actionTokens))
            .attr('font-size', fontSize)
            .attr('transform', `translate(${-fontSize/2},${fontSize/3})`)
        

        return player
    },
    postSmiley: function(discordMsg){
        const svgString = `
        <svg id="smiley2" height="200" width="200">
            <circle cx="100" cy="100" r="100" fill="gold" stroke="black" />
            <g id="eyes" transform="translate(100 60)">
                <circle cx="-40" r="10" fill="black" />
                <circle cx="40" r="10" fill="black" />
            </g>
            <path stroke="black" fill="none" stroke-width="5px" d="M 50 100 A 50 50 0 0 0 150 100"/>
        </svg>`
        
        const fileName = 'smile-test.png'
        
        // create file
        let svgBuffer = Buffer.from(svgString, 'utf-8')
        let svgSharp = sharp(svgBuffer)
            .toFormat('png')
            .toBuffer()
            .then(data => {
                const attachmentFromBuffer = new MessageAttachment(data, {
                    id: SnowflakeUtil.generate(),
                    filename: fileName,
                    description: 'Yellow smiley face for testing',
                    media_type: 'image'
                })

                console.log(data)
                discordMsg.channel.send({ files: [ data ] })
                .then(res => {
                    console.log(res)
                })
                .catch(err => {
                    console.log(err)
                })
            })
            .catch(err => {
                console.log("sharp image failed:", err)
            })
    }
}

export default Game

/*

    0   1   2   3   4   5   6   7   8   9
   _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
A |der|   |   |   |   |   |   |   |   |   |
  |_1_|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|
B |   |   |   |   |   |   |   |   |   |   |
  |_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|
C |   |   |   |   |   |pea|   |   |   |   |
  |_ _|_ _|_ _|_ _|_ _|_1_|_ _|_ _|_ _|_ _|
C |   |aby|   |   |   |   |   |   |   |   |
  |_ _|_2_|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|
E |   |   |doo|   |   |   |   |   |   |   |
  |_ _|_ _|_3_|_ _|_ _|_ _|_ _|_ _|_ _|_ _|
F |   |   |   |   |   |   |   |   |   |   |
  |_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|
G |   |   |   |   |   |   |   |som|   |   |
  |_ _|_ _|_ _|_ _|_ _|_ _|_ _|_1_|_ _|_ _|
H |   |   |   |   |   |   |   |   |   |   |
  |_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|
I |   |   |   |   |   |   |   |   |   |   |
  |_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|
J |   |   |   |   |   |   |   |   |   |   |
  |_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|_ _|


small = true

  0 1 2 3 4 5 6 7 8 9
a . . . . . . . . . .
b . . . . . . . . . .
c . . . r . . . . . .
d . . . . . . j . . .
e . . . . . . . . . .
f . . . . . . t . . .
g . . . . . . . . . .
h . . . . . a . . . .
i . . . . . . . . . .
j . . . . . . . . . .

*/