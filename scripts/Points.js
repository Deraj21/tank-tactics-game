class Points extends MyElement {
    constructor(value){
        super()
        
        // element
        this.tokensContainer = this.createElement('div', {
            className: 'tokens-container'
        })
        for (let i = 0; i < 5 && i < value; i++){
            this.tokensContainer.appendChild(
                this.createElement('div', {
                    className: 'point-token'
                })
            )
        }

        this.setValue(value)
    }

    setValue(v){
        v = Math.floor(v)
        this.value = v < 0 ? 0 : v
    }
}