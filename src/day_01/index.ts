import fs from 'node:fs'
import readline from 'readline'
import '../utils/env.js'
import { LocationIds } from './LocationIds.js'
import { SortedLocationIds } from './SortedLocationIds.js'
import { logger } from "./logger.js"

const filePath = `./src/day_01/${process.env.INPUT_FILE}`
const fileStream = fs.createReadStream(filePath)

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
})

const locationIds: LocationIds = {
  left: [],
  right: []
}

rl.on('line', (line) => {
  // Reading lines from the file, assigning left and right numbers
  const [left, right] = line.trim().split(/\s+/);
  locationIds.left.push(Number(left))
  locationIds.right.push(Number(right))
})

rl.on('close', () => {
  // Sort all ids from left and right lists
  const sorted = new SortedLocationIds(locationIds)

  // Ex 01
  logger.info(sorted.getTotalDistance())

  // Ex 02
  logger.info(sorted.getSimilarityScore())
})
