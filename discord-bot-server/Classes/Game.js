import Utils from './Utilities.js'
import jsdom from 'jsdom'
import sharp from 'sharp'
import { MessageAttachment, MessagePayload, SnowflakeUtil,  } from 'discord.js'

import { select } from 'd3'

// const { select } = d3
const { JSDOM } = jsdom
const dom = new JSDOM('<!DOCTYPE thml><body></body>')

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