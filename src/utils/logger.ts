import moment from 'moment'
import { format, createLogger, transports, Logger } from 'winston'
const { combine, timestamp, label, printf } = format;
import { styleLogTimeStamp, styleLoggerName, styleLogLevel } from './color.js';

export enum LogLevel {
    Debug = 'debug',
    Info = 'info',
    Warn = 'warn',
    Error = 'error'
}

// Utility function for conversion
export namespace LogLevel {
    export function fromString(value: string): LogLevel | undefined {
        return Object.values(LogLevel).includes(value as LogLevel)
            ? (value as LogLevel)
            : undefined; // Return undefined if not valid
    }
}

export function getLogLevelFromEnv(): LogLevel {
    const logLevel = process.env.LOG_LEVEL?.toLowerCase()
    if (Object.values(LogLevel).includes(logLevel as LogLevel)) {
        return logLevel as LogLevel
    }
    return LogLevel.Info
}

// Caching
const loggerInstances: Record<string, Logger> = {}

const loggerFor = (loggerName: string): Logger => {

    // Return the cached instance of a Logger if it already exist
    if (loggerInstances[loggerName]) {
        return loggerInstances[loggerName]
    }

    // Console formatter
    const consoleLoggerFormat = printf(({ level, message, label, timestamp }) => {
        const formated = moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
        return `${styleLogTimeStamp(formated)} ${styleLoggerName('['+(label || loggerName)+']')}${styleLogLevel('['+level.toUpperCase()+']', LogLevel.fromString(level))}: ${message}`;
    })

    // File formatter
    const fileLoggerFormat = printf(({ level, message, label, timestamp }) => {
        const formated = moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
        return `${formated} [${label || loggerName}][${level.toUpperCase()}]: ${message}`
    })

    const logger = createLogger({
        level: getLogLevelFromEnv(),
        format: combine(
            label({ label: loggerName }),
            timestamp(),
        ),
        transports: [
            new transports.Console({
                format: consoleLoggerFormat
            }),
            new transports.File({ 
                filename: `./src/${loggerName.toLowerCase()}/exec.log`,
                format: fileLoggerFormat 
            })
        ]
    })

    // Cache the created logger
    loggerInstances[loggerName] = logger;
    logger.info(`New Logger created → ${loggerName}`)

    return logger
} 

export { loggerFor }