class GameBoard extends MyElement {
    constructor(boardId, settings){
        super()

        let { numCols, numRows, numPlayers, tankColors, tankNames } = settings

        this.tanks = []

        // set up game board
        const gameBoard = document.getElementById(boardId)

        for (let r = 0; r < numRows; r++){
            // create row
            let newRow = document.createElement('div')
            newRow.className = 'row'
            newRow.id = `row-${r}`

            for (let c = 0; c < numCols; c++){
                // create square
                let newSquare = document.createElement('div')
                newSquare.className = 'square'
                newSquare.id = `square-${r}-${c}`
                newSquare.ondragover = (e) => this._onDragOver(e)
                newSquare.ondrop = this._onDrop.bind(this)

                // append to row
                newRow.appendChild( newSquare )
            }

            // append row to board
            gameBoard.appendChild( newRow )
        }

        // create & append tanks
        for (let i = 0; i < numPlayers; i++){
            this.tanks.push(new Tank(
                numRows, numCols,
                tankColors[i%tankColors.length],
                tankNames[i%tankNames.length],
                i
            ))
        }
    }

    _onDragOver(e){
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }

    _onDrop(e){
        e.preventDefault()

        let id = e.dataTransfer.getData("text/id")
        let shortId = id.split("-")[1]
        let pos = e.target.id.split("-")
        let droppedTank = this.tanks.find(tank => tank.id == shortId)

        // check if already tank there or if not a square
        if (e.target.hasChildNodes() || !e.target.id.includes('square')) {
            return;
        } else if ( Math.abs(droppedTank.position.r - parseInt(pos[1])) > 1 ||
        Math.abs(droppedTank.position.c - parseInt(pos[2])) > 1 ){ // check if drop is within 1 square away
            return;
        }

        e.target.appendChild( document.getElementById(id) )
        // update tank vars
        droppedTank.move(pos[1], pos[2])

    }
}