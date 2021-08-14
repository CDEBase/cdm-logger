import * as Logger from 'browser-bunyan'
import { CdmLogger } from '@cdm-logger/core';
import { ILoggerSettings } from './interfaces';

import { ConsoleStream } from './console-stream';

export function getSettingsLevel(settings: ILoggerSettings) {
    return settings.level || 'info';
}
export function getConsoleStream(settings?: ILoggerSettings): any {
    if (!settings) {
        settings = {};
    }

    const rawStream = new ConsoleStream();

    return {
        level: getSettingsLevel(settings),
        stream: rawStream
    }
}

export class ClientLogger {
    static create(name: string | Object, settings?: ILoggerSettings) {
        return makeLogger(name, getConsoleStream(settings));
    }
}

export function getLoggerOptions(name: string, ...streams) {
    if (!name) {
        throw Error('Cannot create LoggerOptions without a log name')
    }
    const options: any = {
        name: name,
        src: false,
        serializers: Logger.stdSerializers,
    }
    if (streams && streams.length) {
        options.streams = streams;
    }
    return options;;
}

export function makeLogger(name: string | Object, ...streams) {
    const logName = typeof name === 'object' ? name.constructor.toString().match(/class ([\w|_]+)/)[1] : name
    return Logger.createLogger(getLoggerOptions(logName, ...streams)) as unknown as CdmLogger.ILogger;
}