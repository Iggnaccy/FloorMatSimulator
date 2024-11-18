// tableRandomizer.js

class TableRandomizer {
    constructor(chance = 0.5) {
        this.chance = chance;
    }

    process(array, width, height) {
        for (let i = 0; i < array.length; i++) {
            array[i] = Math.random() >= this.chance;
        }
    }
    
    setChance(chance) {
        this.chance = chance;
    }
}

module.exports = TableRandomizer;