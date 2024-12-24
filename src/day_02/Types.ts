import { logger } from './logger.js'

export interface Game {
    reports: Report[]
}

export interface Report {
    levels: Level[]
    valid?: boolean
}

export class Report {
    levels: Level[] = []
    valid?: boolean = false

    constructor(levels: Level[]) {
        this.levels = levels
    }

    // Recursivly check levels validity with basic levels, 
    // without the first and then the second problematic level
    checkValidity(withDampner: boolean = false, levels: Level[] = this.levels): void {
        withDampner ? 
            logger.debug(`Testing Report(${levels.map(l => l.num)}) with Dampner`) 
            : logger.debug(`Testing Report(${levels.map(l => l.num)}) without Dampner`)

        let prev: Level = null
        let curr: Level = null
        let next: Level = null
        
        // Handle case where there is only one Level in a Report and we can't compare
        // if (levels.length < 2) {
        //     this.valid = true
        // } else {
            // Define if each report is safe or not
            let direction: "increasing" | "decreasing" | null = null;
            const isValid = !levels.some((current: Level, index: number, array: Level[]) => {
                if (index < array.length -1) {
                    prev = index !== 0 ? array[index-1] : null
                    curr= current
                    next = array[index+1]
                    const step: number = Math.abs(current.num - next.num)

                    // Check for invalid step
                    if (step === 0 || step > 3) {
                        logger.debug(`Invalid Report ❌ ${current.num} → ${next.num} step(${step}) is not allowed`)
                        return true // Invalid step
                    }

                    // Check for direction change
                    const currentDirection = current.num < next.num ? "increasing" : "decreasing"
                    if (direction === null) {
                        direction = currentDirection
                    } else if (direction !== currentDirection) {
                        logger.debug(`Invalid Report ❌ ${current.num} → ${next.num} changed direction from ${direction} to ${currentDirection}`)
                        return true // Invalid direction change
                    }

                    return false // Keep checking
                }
            })

            logger.debug(`BEFORE this.valid(${this.valid}) isValid(${isValid})`)
            this.valid = !this.valid ? isValid : this.valid
            logger.debug(`AFTER this.valid(${this.valid}) isValid(${isValid})`)
            // if (!this.valid && !isValid)
            // this.valid = isValid

            if (!isValid && withDampner) {
                logger.debug(`Invalid Report validity. Checking with Dampner...`)

                // Create 3 copies of the Report Levels
                const prevLevels = [...this.levels]
                const currLevels = [...this.levels]
                const nextLevels = [...this.levels]

                // Erase the Levels which generate the Report invalidity
                prevLevels.splice(prev?.index, 1)
                currLevels.splice(curr.index, 1)
                nextLevels.splice(next.index, 1)
                logger.debug(`Previous Levels(${prevLevels.map(t => t.num)})`)
                logger.debug(`Current Levels(${currLevels.map(t => t.num)})`)
                logger.debug(`Next Levels(${nextLevels.map(t => t.num)})`)

                // Check again the Report validity without the Dampner and with the 2-3 new Levels lists
                if (prev) this.checkValidity(false, prevLevels)
                this.checkValidity(false, currLevels)
                this.checkValidity(false, nextLevels)
                logger.debug(`Invalid Report validity checked with Dampner: ${this.valid}`)
            }
        // }
    }
}

export interface Level {
    num: number,
    index: number
}