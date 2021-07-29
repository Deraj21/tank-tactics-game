class Tank {
    constructor(numRows, numCols, color){
        this.position = {
            r: 0,
            c: 0
        }
        this.actionPoints = 0
        this.health = 3
        this.range = 2

        this.randomizePos(numRows, numCols)
        
        // tank element
        this.element = document.createElement('div')
        this.element.className = 'Tank'
        this.element.style.backgroundColor = color

        this.appendTank()
    }
    
    appendTank(){
        let { r, c } = this.position
        let square = document.getElementById(`square-${r}-${c}`)
        square.appendChild(this.element)
    }

    drag(){

    }

    drop(){

    }

    randomizePos(numRows, numCols){
        let r = Math.floor(Math.random() * numRows)
        let c = Math.floor(Math.random() * numCols)

        this.position = { r, c }
    }

    shoot(){

    }

    trade(){

    }

    takeDamage(){

    }

    gainActionPoint(){
        this.actionPoints++
    }

}