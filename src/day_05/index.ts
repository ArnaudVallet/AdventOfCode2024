import '../utils/env.js'
import { logger } from './logger.js'
import { FileLineReader } from '../utils/FileLineReader.js'
import { SafetyManual } from './types.js'

const filePath = `./src/day_05/${process.env.INPUT_FILE || 'input.txt'}`
const fileLineReader: FileLineReader = new FileLineReader()
await fileLineReader.readFile(filePath)
logger.info(`Finished reading ${fileLineReader.lines.length} lines.`)

const rules: string[] = fileLineReader.lines.filter(item => item.includes('|'))
const updates: string[] = fileLineReader.lines.filter(element => !element.includes("|") && element.trim() !== "")
const safetyManual: SafetyManual = new SafetyManual(rules, updates)

safetyManual.findCorrectUpdatesScore()
logger.info(`Score for ex_01: ${safetyManual.score}`)
safetyManual.findIncorrectUpdatesScore()
logger.info(`Score for ex_02: ${safetyManual.incorrectUpdatesScore}`)
logger.info(`InvalidUpdates count : ${safetyManual.invalidUpdates.length}`)


