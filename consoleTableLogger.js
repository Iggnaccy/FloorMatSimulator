// consoleTableLogger.js

class ConsoleTableLogger {
    process(table, width, height) {
        console.log();
        for(let y = 0; y < height; y++)
        {
            let s = "";
            for(let x = 0; x < width; x++)
            {
                s += table[x + y * width] ? '⬜' : '⬛';
            }
            console.log(s);
        }
    }
}

module.exports = ConsoleTableLogger;