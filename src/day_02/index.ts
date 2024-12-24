import '../utils/env.js'
import { Game, Report, Level } from './Types.js'
import { FileLineReader } from '../utils/FileLineReader.js'
import { logger } from './logger.js'

const game: Game = {
    reports: []
}

const filePath = `./src/day_02/${process.env.INPUT_FILE || 'input.txt'}`
const fileLineReader: FileLineReader = new FileLineReader()
await fileLineReader.readFile(filePath)
logger.info('finished reading the lines')

// Setup
for (const line of fileLineReader.lines) {
    const levels: Level[] = line.split(" ").map((level, index) => ({
        num: parseInt(level, 10),
        index
    }))
    const report: Report = new Report(levels) 
    game.reports.push(report)
}
logger.info(`Set up Game with ${game.reports.length} Reports.`)

// Find valid Reports
let validReports: number = 0
let invalidReports: number = 0
for (const report of game.reports) {

    report.checkValidity(true)
    if (report.valid) {
        logger.debug(`Report valid ✅`)
        validReports++
    } else {
        invalidReports++
    }
}
logger.info(`Valid Reports count → ${validReports}`)
logger.info(`Invalid Reports count → ${invalidReports}`)
