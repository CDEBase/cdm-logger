import { ClientLogger } from './client-logger';
import { LoggerLevel } from './interfaces';
import { getEnvironment } from '@cdm-logger/core';

const env = getEnvironment(); 
const appName = env?.APP_NAME || 'FullStack';
const logLevel: LoggerLevel = (env?.LOG_LEVEL as LoggerLevel) || 'info';
const logger = ClientLogger.create(appName, { level: logLevel });

export { logger };