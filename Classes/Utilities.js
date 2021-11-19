const   H = 1200,
        W = 1200,
        margin = {
            left:   40,
            right:  10,
            top:    40,
            bottom: 10
        }

export default {
    dummyUsernames: ['AbyssalMoth', 'D00mIncarnate', 'PearlHeart', 'ConfusedDoggo'],
    ROW_NAMES: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
    DIRECTIONS: ['N','S','W','E','NW','SW','NE','SE'],
    H: H,
    W: W,
    margin: margin,
    innerH: H - margin.top - margin.bottom,
    innerW: W - margin.left - margin.right,
    fontSize: W / 50,
    shortNameLength: 6,
    maxHealth: 3, // eventually make into database game setting


    // takes any string, and hashes it into rgb values
    hashRGB: function (str, lighten = true){
        // Taken and reworked from https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
        str = str + str;

        // string to hash
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        // hash to hex
        let c = (hash & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();

        let hex = "00000".substring(0, 6 - c.length) + c;

        // hex to RGB
        const hexVals = {
            "0": 0, "1": 1, "2":  2, "3":  3, "4":  4, "5":  5, "6":  6, "7":  7,
            "8": 8, "9": 9, "A": 10, "B": 11, "C": 12, "D": 13, "E": 14, "F": 15
        };
        let r = hexVals[hex[0]] * 16 + hexVals[hex[1]];
        let g = hexVals[hex[2]] * 16 + hexVals[hex[3]];
        let b = hexVals[hex[4]] * 16 + hexVals[hex[5]];

        // lighten
        if (lighten){
            const lightenFactor = .6 // closer to 1 = closer to white
            const max = 255
            let [rl,gl,bl] = [r,g,b].map(color => {
                return Math.floor(color + ((max - color) * lightenFactor))
            })

            return `RGB(${rl},${gl},${bl})`
        } else {
            return `RGB(${r},${g},${b})`
        }
    },

    parseBool: function(str){
        let lower = str.toLowerCase()
        return lower === 'true' ? true : lower === 'false' ? false : null
    },

    catchError: function(str) {
        if (typeof str == "string" && str.match(/\d{3}/)){
            return str
        }
        return false
    },

    randomFromList(arr){
        let i = Math.floor( Math.random() * arr.length )
        return arr.splice(i, 1)[0]
    },

    getDeathMessage() {
        return this.randomFromList([
            " is no longer with us.",
            " has gone the way of all the earth.",
            " has un-alived.",
            " kicked the bucket.",
            " is being let go.",
            "'s life is going in a different direction.",
            "'s tank is part of a permanent outplacement."
        ])
    }
}