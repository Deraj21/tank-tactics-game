class Tank extends MyElement {
    constructor(numRows, numCols, color, name, id){
        super()

        this.position = {
            r: 0,
            c: 0
        }
        this.actionPoints = 0
        this.health = 3
        this.range = 2
        this.id = id
        this.name = name

        this.randomizePos(numRows, numCols)
        
        // tank element
        this.element = document.createElement('div')
        this.element.className = 'Tank'
        this.element.style.backgroundColor = color

        // range
        let rangeElement = this.createElement('p', {
            className: 'tank-range',
            innerHTML: `R = ${this.range}`
        })
        this.element.appendChild(rangeElement)
        // health
        let h = new Health(2)
        let healthElement = h.heartContainer
        this.element.appendChild(healthElement)
        // id & name
        let nameElement = this.createElement('p', {
            className: 'tank-name',
            innerHTML: `${this.id}-${this.name}`
        })
        this.element.appendChild(nameElement)
        // action points
        let pointsElement = this.createElement('div', {
            className: "point-token",
            innerHTML: this.actionPoints
        })
        this.element.appendChild(pointsElement)

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