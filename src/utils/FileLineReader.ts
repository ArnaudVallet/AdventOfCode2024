import fs from 'node:fs'
import readline from 'readline'

export class FileLineReader {
    lines: string[] = []

    // Read lines from file and populate tha lines property
    async readFile(filePath: string): Promise<void> {
        const fileStream: fs.ReadStream = fs.createReadStream(filePath)

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        })

        for await (const line of rl){
            this.lines.push(line)
        }
    }
}