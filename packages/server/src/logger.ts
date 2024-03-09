import { CdmLogger } from '@cdm-logger/core';
import { ConsoleLogger, IConsoleLoggerSettings } from './console-logger';

const settings: IConsoleLoggerSettings = {
    level: process.env.LOG_LEVEL as CdmLogger.LoggerLevel  || 'info',
};

const appName = process.env.APP_NAME || 'CDM_APP';

export const logger = ConsoleLogger.create(appName, settings);