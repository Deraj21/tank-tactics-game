class Health extends MyElement {
    constructor(value){
        super()
        
        // element
        this.heartContainer = this.createElement('div', {
            className: 'heart-container'
        })
        this.heartElements = []
        for (let i = 0; i < 3; i++){
            let currentHeart = this.createElement('div', {
                className: 'heart'
            })
            this.heartElements.push( currentHeart )
            this.heartContainer.appendChild( currentHeart )
        }

        this.setValue(value)
    }

    setValue(v){
        v = Math.floor(v)
        this.value = v > 3 ? 3 : v < 0 ? 0 : v

        this.heartElements.forEach((heart, i) => {
            if (i+1 <= this.value){
                heart.classList.add('filled')
            } else {
                heart.classList.remove('filled')
            }
        })
    }
}