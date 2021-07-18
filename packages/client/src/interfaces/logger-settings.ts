
export interface IClientLoggerSettings extends ILoggerSettings {
    /** defaults to short */
    mode?: 'short' | 'long' | 'dev' | 'raw';
}



export const TRACE = 10
export const DEBUG = 20
export const INFO = 30
export const WARN = 40
export const ERROR = 50
export const FATAL = 60
export const LEVEL_NAMES = {
    'trace': TRACE,
    'debug': DEBUG,
    'info': INFO,
    'warn': WARN,
    'error': ERROR,
    'fatal': FATAL
}

export type LoggerLevel = keyof typeof LEVEL_NAMES;


export interface ILoggerSettings {
    /** defaults to INFO */
    level?: LoggerLevel;
}