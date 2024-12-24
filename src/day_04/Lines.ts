import { logger } from "./logger.js"

export class Lines {
    width: number = 0
    height: number = 0
    horizontals: string[] = []
    verticals: string[] = []
    diagonals: string[] = []
    antiDiagonals: string[] = []
    pattern = /XMAS/g
    XMASCounter: number = 0
    X_MASCounter: number = 0

    constructor(lines: string[]) {
        this.horizontals = lines
        this.width = lines[0].length
        this.height = lines.length
        this.createVertical()
        this.createDiagonals()
        this.countXMAS()
        this.countX_MAS()
    }

    countX_MAS() {
        let counter = 0
        for (let row = 1; row < this.height-1; row++) {
            for (let col = 1; col < this.width-1; col++) {
                if(this.horizontals[row][col] === 'A') {
                    logger.debug(`Letter is ${this.horizontals[row][col]} at position row(${row}) col(${col})`)
                    logger.debug(`Line is ${this.horizontals[row]}`)
                    const diag1: string = this.horizontals[row-1][col-1] + 'A' + this.horizontals[row+1][col+1]
                    const diag2: string = this.horizontals[row+1][col-1] + 'A' + this.horizontals[row-1][col+1]
                    if ((diag1 === 'MAS' || diag1 === 'SAM') 
                        && (diag2 === 'MAS' || diag2 === 'SAM')) {
                            counter++
                    }
                }
            }
        }
        logger.info(`Found ${counter} X-MAS`)
        this.X_MASCounter = counter
    }

    countXMAS() {
        let XMASTotal: number = 0
        const globalLines: string[] = this.horizontals
                                        .concat(this.verticals)
                                        .concat(this.diagonals)
                                        .concat(this.antiDiagonals)
        globalLines.forEach((line: string) => {
            const reversedLine: string = line.split('').reverse().join('')
            logger.debug(`line(${line}) reversedLine(${reversedLine})`)
            XMASTotal += line.match(this.pattern)?.length ?? 0
            XMASTotal += reversedLine.match(this.pattern)?.length ?? 0
        })
        logger.debug(`Found XMAS/SAMX matches : ${XMASTotal}`)
        this.XMASCounter = XMASTotal
    }

    private createVertical() {
        for (const line of this.horizontals) {
            line.split('').forEach((char, i) => {
                this.verticals[i] = this.verticals[i] ? this.verticals[i] += char : char 
            })
        }
    }

    private createDiagonals() {
        const diagonals = [];
        const antiDiagonals = [];

        // Top-left to bottom-right (main diagonals)
        for (let start = -(this.height - 1); start < this.width; start++) {
            const diagonal = [];
            for (let row = 0; row < this.height; row++) {
                const col = start + row;
                if (col >= 0 && col < this.width) {
                    diagonal.push(this.horizontals[row][col]);
                }
            }
            if (diagonal.length > 3) {
                diagonals.push(diagonal.join(''));
            }
        }
        this.diagonals = diagonals

        // Top-right to bottom-left (anti-diagonals)
        for (let start = 0; start < this.height + this.width - 1; start++) {
            const antiDiagonal = [];
            for (let row = 0; row < this.height; row++) {
                const col = start - row;
                if (col >= 0 && col < this.width) {
                    antiDiagonal.push(this.horizontals[row][col]);
                }
            }
            if (antiDiagonal.length > 3) {
                antiDiagonals.push(antiDiagonal.join(""));
            }
        }
        this.antiDiagonals = antiDiagonals
    }
}
