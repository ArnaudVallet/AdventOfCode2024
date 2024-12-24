import '../utils/env.js'
import { logger } from './logger.js'
import { FileLineReader } from '../utils/FileLineReader.js'
import { Lines } from './Lines.js'

const filePath = `./src/day_04/${process.env.INPUT_FILE || 'input.txt'}`
const fileLineReader: FileLineReader = new FileLineReader()
await fileLineReader.readFile(filePath)
logger.info(`Finished reading ${fileLineReader.lines.length} lines.`)
logger.debug(fileLineReader.lines.map(l => '\n'+l))

const lines: Lines = new Lines(fileLineReader.lines)
