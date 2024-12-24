import delay from "../utils/delay.js"
import { logger } from "./logger.js"

export class GameBoard {
    area: string[]
    startingPosition: { row: number, col: number, direction: '^' | 'v' | '<' | '>' }
    guardPosition: { row: number, col: number, direction: '^' | 'v' | '<' | '>', hasVisited: boolean }
    guardPattern: RegExp = new RegExp(/[\^<>v]/g)
    positionsCount: number = 0

    constructor(rows: string[]) {
        this.area = rows
        this.startingPosition = this.guardPosition = this.getGuardPosition()
    }

    display() {
        logger.info('------ GameBoard ------')
        for (const row of this.area) {
            logger.info(row)
        }
        logger.info('-----------------------')
    }

    private clearDisplay() {
        for (let i = 0; i < this.area.length + 2; i++) {
            process.stdout.write('\x1b[1A'); // Move cursor up by one line
            process.stdout.write('\x1b[2K'); // Clear the entire line
        }
    }

    getGuardPosition(): { row: number, col: number, direction: '^' | 'v' | '<' | '>', hasVisited } {
        let position = { row: null, col: null, direction: null }
        this.area.forEach((row: string, rowIndex: number) => {
            const colIndex = row.search(this.guardPattern)
            if (colIndex !== -1) position = { 
                row: rowIndex, 
                col: colIndex, 
                direction: this.area[rowIndex][colIndex] 
            }
        })
        logger.debug(`Guard is at position row(${position.row}) col(${position.col}) in direction ${position.direction}`)
        return position
    }

    guardIsLeaving(): boolean {
        return (
                (this.guardPosition.row === 0 && this.guardPosition.direction === '^')
            ||  (this.guardPosition.row +1 === this.area.length && this.guardPosition.direction === 'v' ) 
            ||  (this.guardPosition.col === 0 && this.guardPosition.direction === '<')
            ||  (this.guardPosition.col +1 === this.area[0].length && this.guardPosition.direction === '>')
        )
    }

    guardIsLooping(): boolean {

    }

    guardNextPosition(): { row: number, col: number, direction: '^' | 'v' | '<' | '>', destination: '-' | '|' | '+' | '.' | 'X'  } {
        switch (this.guardPosition.direction) {
            case '^': {
                let facingObstacle: boolean = this.area[this.guardPosition.row-1][this.guardPosition.col] === '#'
                return { 
                    row: facingObstacle ? this.guardPosition.row : this.guardPosition.row-1, 
                    col: this.guardPosition.col, 
                    direction: facingObstacle ? '>' : this.guardPosition.direction
                }
            }

            case '>': {
                let facingObstacle: boolean = this.area[this.guardPosition.row][this.guardPosition.col+1] === '#'
                return { 
                    row: this.guardPosition.row, 
                    col: facingObstacle ? this.guardPosition.col : this.guardPosition.col+1, 
                    direction: facingObstacle ? 'v' : this.guardPosition.direction
                }
            }
            
            case 'v': {
                let facingObstacle: boolean = this.area[this.guardPosition.row+1][this.guardPosition.col] === '#'
                return {
                    row: facingObstacle ? this.guardPosition.row : this.guardPosition.row+1,
                    col: this.guardPosition.col,
                    direction: facingObstacle ? '<' : this.guardPosition.direction
                }
            }

            case '<': {
                let facingObstacle: boolean = this.area[this.guardPosition.row][this.guardPosition.col-1] === '#'
                return {
                    row: this.guardPosition.row,
                    col: facingObstacle ? this.guardPosition.col : this.guardPosition.col-1,
                    direction: facingObstacle ? '^' : this.guardPosition.direction
                }
            }
        
            default:
                throw new Error(`Can't predict guard next position.`)
        }
    }

    async executeGuardPatrol() {
        while(!this.guardIsLeaving()) {
            const nextPosition = this.guardNextPosition()
            const currentPosition = this.guardPosition
            const guardRotating = nextPosition.direction !== currentPosition.direction

            // Update previous position with an "X" if guard not doing a pivot or with the new guard direction
            if (!guardRotating) {
                this.area[currentPosition.row] = this.replaceAt(currentPosition.col, this.area[currentPosition.row], "X")
            }
            // Update the next location of the guard with its direction
            this.area[nextPosition.row] = this.replaceAt(nextPosition.col, this.area[nextPosition.row], nextPosition.direction)

            // Update guard position
            this.guardPosition = nextPosition
            this.display()
            await delay(10)
            this.clearDisplay()
        }
        this.display()
        this.countGuardPositions()
    }

    private countGuardPositions() {
        let score: number = 0
        for (const row of this.area) {
            const matches = row.match(/[X\^<>v]/g)
            if (matches) score += matches.length
        }
        this.positionsCount = score
    }

    private replaceAt(index: number, from: string, char: string): string {
        return from.substring(0, index) + char + from.substring(index+1)
    }

}