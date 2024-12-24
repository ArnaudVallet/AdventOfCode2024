import { LogLevel } from "./logger.js"

const reset = "\x1b[0m"
const red = "\x1b[31m"
const green = "\x1b[32m"
const yellow = "\x1b[33m"
const blue = "\x1b[34m"
const grey = "\x1b[90m"
const magenta = "\x1b[95m"

export const styleLogLevel = (
    txt: string,
    logLevel: LogLevel
): string => {
    switch (logLevel) {
        case LogLevel.Info:
            return `${blue + txt + reset}`
        case LogLevel.Debug:
            return `${green + txt + reset}`
        case LogLevel.Warn:
            return `${yellow + txt + reset}`
        case LogLevel.Error:
            return `${red + txt + reset}`
        default:
            return txt
    }
}

export const styleLogTimeStamp = (
    txt: string,
): string => {
    return `${grey + txt + reset}`
}

export const styleLoggerName = (
    txt: string
): string => {
    return `${magenta + txt + reset}`
}
