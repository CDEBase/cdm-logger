import { ConsoleLogger, IConsoleLoggerSettings } from './console-logger';
import { LoggerLevel } from '@cdm-logger/core';
import * as Logger from 'bunyan';

const settings: IConsoleLoggerSettings = {
    level: process.env.LOG_LEVEL as LoggerLevel  || 'info',
};

const appName = process.env.APP_NAME || 'CDM_APP';

export const logger: Logger = ConsoleLogger.create(appName, settings);