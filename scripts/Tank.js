let tankPositions = []

class Tank extends MyElement {
    constructor(numRows, numCols, color, name, id){
        super()

        this.position = {
            r: 0,
            c: 0
        }
        this.actionPoints = 99
        this.health = 3
        this.range = 2
        this.id = id
        this.name = name

        this.randomizePos(numRows, numCols)
        
        // tank element
        this.element = this.createElement('div', {
            className: 'Tank' + (this.actionPoints > 0 ? ' draggable' : ''),
            id: `tank-${id}`,
            draggable: true,
            ondragstart: this._dragStart.bind(this)
        })
        this.element.style.backgroundColor = color
        // range
        let rangeElement = this.createElement('p', {
            className: 'tank-range',
            innerHTML: `R = ${this.range}`
        })
        this.element.appendChild(rangeElement)
        // health
        let h = new Health(this.health)
        let healthElement = h.heartContainer
        this.element.appendChild(healthElement)
        // id & name
        let nameElement = this.createElement('p', {
            className: 'tank-name',
            innerHTML: `${this.id}-${this.name}`
        })
        this.element.appendChild(nameElement)
        // action points
        this.pointsElement = this.createElement('div', {
            className: "point-token",
            innerHTML: this.actionPoints
        })
        this.element.appendChild(this.pointsElement)

        this.appendTank()
    }
    
    appendTank(){
        let { r, c } = this.position
        let square = document.getElementById(`square-${r}-${c}`)
        square.appendChild(this.element)
    }

    _dragStart(e){
        if (this.actionPoints < 1){
            return;
        }

        e.dataTransfer.dropEffect = "move"
        e.dataTransfer.setData("text/id", e.target.id)
    }

    move(r, c){
        this.position.r = r
        this.position.c = c
        this.loseActionPoint()
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

        if (this.actionPoints > 0){
            this.element.draggable = true
            this.element.classList.add('draggable')
        }
    }

    loseActionPoint(){
        this.actionPoints--
        this.pointsElement.innerHTML = this.actionPoints

        if (this.actionPoints < 1){
            this.element.draggable = false
            this.element.classList.remove('draggable')
        }
    }

}