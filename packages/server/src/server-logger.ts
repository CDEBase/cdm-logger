import * as Logger from 'bunyan';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import { ILoggerSettings, makeLogger, getSettingsLevel, CdmLogger } from '@cdm-logger/core';
const PrettyStream = require('bunyan-prettystream-circularsafe');

export interface IFileLoggerSettings extends ILoggerSettings, Logger.Stream {
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
        level: getSettingsLevel(settings),
        type: 'rotating-file',
        path: logFile,
        period: settings.period || '1d',
        count: settings.period || 3 as any,
    }
}

export class FileLogger {
    static create(name: string | Object, settings?: IFileLoggerSettings) {
        return makeLogger(Logger, name, getFileLogStream(settings, name.toString()));
    }
}