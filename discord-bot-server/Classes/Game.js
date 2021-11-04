import Utils from './Utilities.js'
import db from './Database.js'
import jsdom from 'jsdom'
import sharp from 'sharp'
import { MessageAttachment, MessagePayload, SnowflakeUtil } from 'discord.js'

import { select, scaleLinear, axisTop, axisLeft, arc } from 'd3'
const { hashRGB } = Utils

// const { select } = d3
const { JSDOM } = jsdom
const dom = new JSDOM('<!DOCTYPE html><body></body>'),
    H = 600,
    W = H,
    margin = {
        left:   20,
        right:  5,
        top:    20,
        bottom: 5
    },
    NUM_COLS = 10,
    NUM_ROWS = 10,
    ROW_NAMES = ['A','B','C','D','E','F','G','H','I','J'],
    innerW = W - margin.left - margin.right,
    innerH = H - margin.top - margin.bottom,
    w = innerW / NUM_COLS,
    h = innerH / NUM_ROWS


/**
 * Game
 */
class Game {
    constructor(db){
        this.db = db
    }

    startGame(){
        this.db.setGameStarted(true)
        this.randomizePlayerPositions()
    }

    resetGame(){ this.db.resetGame() }

    randomizePlayerPositions(){
        // create flat array of all coordinates
        let coords = []
        for (let r = 0; r < Utils.NUM_ROWS; r++){
            for (let c = 0; c < Utils.NUM_COLS; c++){
                coords.push(r + '-' + c)
            }
        }

        // get players
        let players = this.db.getPlayers().map(player => {
            // for each player, splice coordinate from the list
            let coordinates = Utils.randomFromList(coords).split('-')
            player.position.r = parseInt(coordinates[0])
            player.position.c = parseInt(coordinates[1])

            return player
        })

        // update database
        this.db.updatePlayers(players)
    }

    giveDailyTokens(numTokens = 1){
        // tally votes
        let votes = this.db.getVotes()
        let tally = {}
        for (let key in votes){
            if (tally[votes[key]]){
                tally[votes[key]]++
            } else {
                tally[votes[key]] = 1
            }
        }
        
        this.db.getPlayers().forEach(player => {
            if (!player.isDead){
                player.actionTokens += parseInt(numTokens)
                if (tally[player.name] >= 3){
                    player.actionTokens += parsInt(numTokens)
                }
                this.db.updatePlayer(player.name, { actionTokens: player.actionTokens })
            }
        })

        // 'forget' votes
        this.db.emptyVotes()
    }

    printVotes(){
        let votes = this.db.getVotes()

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

        console.log(text)
        return text
    }

    printBoard(small = false){
        // create board
        let board = []
        let healths = {}
        for (let r = 0; r < Utils.NUM_ROWS; r++){
            let row = []
            for (let c = 0; c < Utils.NUM_COLS; c++){
                row.push(small ? '.' : '   ')
            }

            board.push(row)
        }
        // place 'tanks'
        this.db.getPlayers().forEach(p => {
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
        for (let i = 0; i < Utils.NUM_COLS; i++){
            text += small ? ` ${i}` : `   ${i}`
        }
        text += '\n'
        if (!small){
            text += "  " + " _ _".repeat(Utils.NUM_COLS) + "\n"
        }

        // rows
        board.forEach((row, r) => {
            // text += ''
            text += Utils.ROW_NAMES[r] + ' '
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
    }

    /**
     * @param {Message} - discordMsg
     */
    postBoard(discordMsg){
        const players = this.db.getPlayers()

        // 
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
            .attr('transform', `translate(0,${innerH / NUM_ROWS / 2})`)

        // xAxis
        const xAxisG = g.append('g').call(xAxis)
        xAxisG.selectAll('text')
            .attr('transform', `translate(${innerW / NUM_COLS / 2},0)`)

        // players (tanks)
        players.forEach(playerData => {
            this.appendPlayer(playerData, g)
        })

        const svgString = body.html()
        const fileName = 'tank-tactics-board.png'
        
        // create file and post
        let svgBuffer = Buffer.from(svgString, 'utf-8')
        let svgSharp = sharp(svgBuffer)
            .toFormat('png')
            .toBuffer()
            .then(data => {
                // const attachmentFromBuffer = new MessageAttachment(data, {
                //     id: SnowflakeUtil.generate(),
                //     filename: fileName,
                //     description: 'Tank Tactics Board Update',
                //     media_type: 'image'
                // })

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

    appendPlayer(data, g){
        const { name, shortName, health, actionTokens, range, position, color, isDead } = data
        const textMargin = 3,
            fontSize = 12,
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
            .text(name)
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
    }

    postSmiley(discordMsg){
        const svgString = `
        <svg id="smiley2" height="200" width="200">
            <circle cx="100" cy="100" r="100" fill="green" stroke="black" />
            <g id="eyes" transform="translate(100 60)">
                <circle cx="-40" r="10" fill="black" />
                <circle cx="40" r="10" fill="black" />
            </g>
            <path stroke="black" fill="none" stroke-width="5px" d="M 50 100 A 50 50 0 0 0 150 100"/>
        </svg>`
    
        // setup body
        let body = select(dom.window.document.querySelector('body'))
        
        // build svg
        let svg = body.append('svg')
            .attr('height', 200)
            .attr('width',  200)
        
        let circle = svg.append('circle')
            .attr('cx', 100)
            .attr('cy', 100)
            .attr('r', 100)
            .attr('fill', 'gold')
            .attr('stroke', 'black')
        
        const eyesTrans = { x: 100, y: 60 }
        let eyes = svg.append('g')
            .attr('transform', `translate(${eyesTrans.x}, ${eyesTrans.y}`)
            .attr('stroke', 'black')
        
        let eyeTranslations = [40, -40]
        eyeTranslations.forEach(cx => {
            eyes.append('circle')
                .attr('cx', cx)
                .attr('r', 10)
                .attr('fill', 'black')
        })
        
        let mouth = svg.append('path')
            .attr('d', 'M 50 100 A 50 50 0 0 0 150 100')
            .attr('stroke', 'black')
            .attr('fill', 'none')
            .attr('stroke-width', 5)
            
        const svgString2 = body.html()
        const fileName = 'smile-test.png'
        
        // create file
        let svgBuffer = Buffer.from(svgString2, 'utf-8')
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