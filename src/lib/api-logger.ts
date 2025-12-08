/**
 * Centralized logging for API routes
 * Consistent logging format for debugging and monitoring
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

interface LogEntry {
  level: LogLevel
  timestamp: string
  route: string
  message: string
  data?: Record<string, any>
  error?: string
  duration?: number
}

class Logger {
  private isDev = process.env.NODE_ENV === 'development'

  private format(entry: LogEntry): string {
    const json = {
      ...entry,
      timestamp: new Date().toISOString()
    }
    return JSON.stringify(json)
  }

  log(level: LogLevel, route: string, message: string, data?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      level,
      timestamp: new Date().toISOString(),
      route,
      message,
      ...(data && { data }),
      ...(error && { error: error.message })
    }

    const formatted = this.format(entry)

    if (this.isDev) {
      const color = {
        [LogLevel.DEBUG]: '\x1b[36m',
        [LogLevel.INFO]: '\x1b[32m',
        [LogLevel.WARN]: '\x1b[33m',
        [LogLevel.ERROR]: '\x1b[31m'
      }[level]
      const reset = '\x1b[0m'
      // Use appropriate console method based on level
      const consoleMethod = level === LogLevel.ERROR ? console.error : 
                           level === LogLevel.WARN ? console.warn :
                           level === LogLevel.INFO ? console.info : console.debug
      consoleMethod(`${color}[${level}]${reset} ${formatted}`)
    } else {
      const consoleMethod = level === LogLevel.ERROR ? console.error : 
                           level === LogLevel.WARN ? console.warn :
                           level === LogLevel.INFO ? console.info : console.debug
      consoleMethod(formatted)
    }
  }

  debug(route: string, message: string, data?: Record<string, any>) {
    this.log(LogLevel.DEBUG, route, message, data)
  }

  info(route: string, message: string, data?: Record<string, any>) {
    this.log(LogLevel.INFO, route, message, data)
  }

  warn(route: string, message: string, data?: Record<string, any>) {
    this.log(LogLevel.WARN, route, message, data)
  }

  error(route: string, message: string, error?: Error, data?: Record<string, any>) {
    this.log(LogLevel.ERROR, route, message, data, error)
  }
}

export const logger = new Logger()
