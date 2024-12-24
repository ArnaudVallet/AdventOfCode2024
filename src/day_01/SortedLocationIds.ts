import { LocationIds } from "./LocationIds.js"
import { logger } from "./logger.js"

export class SortedLocationIds {

    left: number[]
    right: number[]
    rightMap: Map<number, number> = new Map()
    
    constructor(locationIds: LocationIds) {
        this.left = locationIds.left.sort((a, b) => a - b)
        this.right = locationIds.right.sort((a, b) => a - b)
        for (const num of this.right) {
            this.rightMap.set(num, (this.rightMap.get(num) || 0 ) + 1 )
        }
    }

    
    getTotalDistance(total: number = 0, depth: number = 0) : number {
        logger.debug(`Depth ${depth} with a total of ${total}`)
        if (depth >= this.left.length) return total
        const distance = Math.abs(this.left[depth] - this.right[depth])
        logger.debug(`Distance between ${this.left[depth]} and ${this.right[depth]} is ${distance}`)
        return this.getTotalDistance(total + distance, depth+1)
    }

    getSimilarityScore(total: number = 0, depth: number = 0) : number {
        logger.debug(`Depth ${depth} with a total of ${total}`)
        if (depth >= this.left.length) return total
        const num: number = this.left[depth]
        const count: number = this.rightMap.get(this.left[depth]) !== undefined ? this.rightMap.get(this.left[depth]) : 0
        logger.debug(`Score is ${num * count} cause ${num} appears ${count} times.`)
        return this.getSimilarityScore(total + num * count, depth + 1)
    }
    
}