import '../utils/env.js'
import { logger } from './logger.js'
import { FileLineReader } from '../utils/FileLineReader.js'

const filePath = `./src/day_03/${process.env.INPUT_FILE || 'input.txt'}`
const fileLineReader: FileLineReader = new FileLineReader()
await fileLineReader.readFile(filePath)
logger.info(`Finished reading ${fileLineReader.lines.length} lines.`)
const instructions: string = fileLineReader.lines.join('')
logger.debug("Base instructions: " + instructions)

// Regex patterns
const mulPattern = /mul\(\d+,\d+\)/g; // Find all "mul(x,y)"
const digitPattern = /\d+/g; // Finc all digits
const dontEraserPattern = /don't\(\).*?do\(\)/g; // Patter to erase from "don't()" to "do()"

// functions
const findMulPatterns = (instructions: string): string[] | null => {
    const matches: string[] | null = instructions.match(mulPattern) ?? []
    return matches
}
const calculateMul = (mulPatterns: string[] | null): number => {
    let res: number = 0
    for (const p of mulPatterns) {
        const [x, y]: number[] = p.match(digitPattern).map(str => parseInt(str))
        res += x*y
    }
    return res
}
const eraseDontToDo = (instructions: string): string => {
    return instructions.replace(dontEraserPattern, "do()")
}

// Results for ex 01 and 02
let result1: number = calculateMul(findMulPatterns(instructions))
let result2: number = calculateMul(findMulPatterns(eraseDontToDo(instructions)))

logger.info(`Ex01 result: ${result1}`)
logger.info(`Ex02 result: ${result2}`)

