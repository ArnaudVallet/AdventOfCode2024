import '../utils/env.js'
import { logger } from './logger.js'
import { FileLineReader } from '../utils/FileLineReader.js'
import { GameBoard } from './GameBoard.js'

const filePath = `./src/day_06/${process.env.INPUT_FILE || 'input.txt'}`
const fileLineReader: FileLineReader = new FileLineReader()
await fileLineReader.readFile(filePath)
logger.info(`Finished reading ${fileLineReader.lines.length} lines.`)


const board = new GameBoard(fileLineReader.lines)
await board.executeGuardPatrol()
logger.info(`Guard went by ${board.positionsCount} different positions.`)