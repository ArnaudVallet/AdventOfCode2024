import { logger } from "./logger.js"

export class SafetyManual {
    rules: Map<number, number[]> = new Map<number, number[]>()
    updates: number[][] = []
    invalidUpdates: number[][] = []
    score: number = 0
    incorrectUpdatesScore: number = 0

    constructor(rules: string[], updates: string[]) {
        for (const rule of rules) {
            const [key, value] = rule.split('|')
            const before: number = parseInt(key)
            const after: number = parseInt(value)
            this.rules.set(before, this.rules.get(before) 
                                    ? [...this.rules.get(before), after] 
                                    : [after]
            )
        }

        for (const update of updates) {
            const newUpdate = update.split(',').map(u => parseInt(u))
            this.updates.push(newUpdate)            
        }
    }

    showRules() {
        this.rules.forEach((value, key) => {
            logger.info(`Key(${key}): values(${value})`)
        })
    }

    showUpdates() {
        this.updates.forEach(update => logger.info(`Update: ${update}`))
    }

    findCorrectUpdatesScore() {
        let score: number = 0
        for (const update of this.updates) {
            let isValid: boolean = true
            update.forEach((page: number, i: number, array: []) => {
                const nextUpdates: number[] = array.slice(i+1)
                nextUpdates.forEach(nextPage => {
                    const pageBeforeNextPage = this.rules.get(page)?.includes(nextPage)
                    const nextPageBeforePage = this.rules.get(nextPage)?.includes(page)
                    if(nextPageBeforePage && !pageBeforeNextPage) {
                        isValid = false
                    }
                })
            })
            if (isValid) {
                const middleIndex = Math.floor(update.length / 2)
                score += update[middleIndex]
            } else {
                this.invalidUpdates.push(update)
            }
        }
        this.score += score
    }

    findIncorrectUpdatesScore() {
        let score: number = 0

        this.invalidUpdates.forEach((update: number[], i: number, invalidUpdates: number[][]) => {
            
            let updateCopy: number[] = [...update] // Create a copy to not modify it
            logger.debug(`Gonna investigate update: ${updateCopy}`)
            
            let isValid: boolean = false
            while (!isValid) {

                

                isValid = updateCopy.every((page: number, pageIndex: number, arr: number[]) => {
                    logger.debug(`PageIndex(${pageIndex})`)
                    const nextUpdates: number[] = arr.slice(pageIndex+1)
                    logger.debug(`PageIndex(${pageIndex})`)
                    logger.debug(`NextUpdates: ${nextUpdates}`)
                    if (!nextUpdates.length) return true // We reached the last element without invalidity

                    const allCorrectOrder: boolean = nextUpdates.every((nextPage: number, nextPageIndex: number) => {
                        const pageBeforeNextPage = this.rules.get(page)?.includes(nextPage)
                        logger.debug(`Page(${page}) rules includes NextPage(${nextPage}) ? => ${pageBeforeNextPage}`)
                        const nextPageBeforePage = this.rules.get(nextPage)?.includes(page)
                        logger.debug(`NextPage(${nextPage}) rules includes Page(${page}) ? => ${nextPageBeforePage}`)

                        if(nextPageBeforePage || !pageBeforeNextPage) {
                            logger.debug(`Update before order change : ${arr}`)
                            const before: number = updateCopy[pageIndex+nextPageIndex+1]
                            logger.debug(`NextPageIndex +1 (${nextPageIndex+1}) Page(${97}) PageIndex(${pageIndex})`)
                            logger.debug(`Before: ${before}`)
                            const after: number = updateCopy[pageIndex]
                            logger.debug(`After: ${after}`)
                            updateCopy[pageIndex] = before
                            updateCopy[pageIndex + nextPageIndex+1] = after
                            logger.debug(`UpdatedCopy: ${updateCopy}`)
                            logger.debug(`Update after inverting ${page} and ${nextPage} : ${update} / ${updateCopy}`)
                            return false
                        } else {
                            logger.debug(`Page(${page}) is in correct order with NextPage(${nextPage}).`)
                            return true
                        }
                    })
                    return allCorrectOrder
                })
            }
            const middleIndex = Math.floor(updateCopy.length / 2)
            logger.debug(`Adding number from corrected update ${updateCopy} score : ${updateCopy[middleIndex]}`)
            score += updateCopy[middleIndex]
        })
        this.incorrectUpdatesScore = score
    }
}