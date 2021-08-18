class MyElement {
    /**
     * 
     * @param {string} type - element type i.e. 'p' or 'div'
     * @param {Object} options - options for element
     */
     createElement(type, options){
        let e = document.createElement(type)
        for (let key in options){
            e[key] = options[key]
        }

        return e
    }
}