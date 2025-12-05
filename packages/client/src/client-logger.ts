import pino from 'pino/browser.js';
import { CdmLogger } from '@cdm-logger/core';
import { ILoggerSettings } from './interfaces';

export function getSettingsLevel(settings: ILoggerSettings) {
    return settings.level || 'info';
}

export function getConsoleStream(settings?: ILoggerSettings): any {
    if (!settings) {
        settings = {};
    }

    return {
        level: getSettingsLevel(settings),
    };
}

export class ClientLogger {
    static create(name: string | Object, settings?: ILoggerSettings) {
        return makeLogger(name, getConsoleStream(settings));
    }
}

export function getLoggerOptions(name: string, others: any = {}) {
    if (!name) {
        throw Error('Cannot create LoggerOptions without a log name');
    }
    const options: any = {
        name: name,
        browser: {
            asObject: true,
        },
        ...others,
    };
    return options;
}

export function makeLogger(name: string | Object, options: any = {}) {
    const logName = typeof name === 'object' 
        ? name.constructor.toString().match(/class ([\w|_]+)/)?.[1] || 'UnknownClass'
        : name;
    return pino(getLoggerOptions(logName, options)) as unknown as CdmLogger.ILogger;
}