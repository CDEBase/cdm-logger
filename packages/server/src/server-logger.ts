import Logger from 'pino';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import { ILoggerSettings, makeLogger, getSettingsLevel } from '@cdm-logger/core';

export interface IFileLoggerSettings extends ILoggerSettings {
    /** defaults to short */
    mode?: 'short' | 'long' | 'dev' | 'raw';
    logPath: string;
}

export function getFileLogStream(settings: IFileLoggerSettings, name: string) {
    const pathParse = path.parse(name);
    const logDir = `${settings.logPath}/${pathParse.dir}`;
    mkdirp.sync(logDir);
    const logFile = path.join(logDir, `${pathParse.name}.log`);
    return {
        type: 'file',
        level: getSettingsLevel(settings),
        path: logFile,    // pino expects path property for file streams
        dest: logFile,    // keeping dest for backward compatibility
        minLength: 4096,  // Buffer before writing
        sync: false,
    }
}

export class FileLogger {
    static create(name: string | Object, settings?: IFileLoggerSettings) {
        return makeLogger(Logger, name, getFileLogStream(settings, name.toString()));
    }
}