const   NUM_COLS = 10,
        NUM_ROWS = 10,
        NUM_PLAYERS = 3,
        TANK_COLORS = ['blue', 'red', 'green', 'yellow']

// set up game board
const gameBoard = document.getElementById("game-board")

for (let r = 0; r < NUM_ROWS; r++){
    // create row
    let newRow = document.createElement('div')
    newRow.className = 'row'
    newRow.id = `row-${r}`

    for (let c = 0; c < NUM_COLS; c++){
        // create square
        let newSquare = document.createElement('div')
        newSquare.className = 'square'
        newSquare.id = `square-${r}-${c}`

        // append to row
        newRow.appendChild( newSquare )
    }

    // append row to board
    gameBoard.appendChild( newRow )
}

// create & append tanks
for (let i = 0; i < NUM_PLAYERS; i++){
    new Tank(NUM_ROWS, NUM_COLS, TANK_COLORS[i%TANK_COLORS.length])
}
