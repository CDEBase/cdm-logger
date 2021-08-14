import { ClientLogger } from './client-logger';
import { LoggerLevel } from './interfaces';

const APP_ENV = typeof process !== 'undefined' && (process['APP_ENV'] || process.env || {})
const appName = APP_ENV.APP_NAME || 'FullStack';
const logLevel: LoggerLevel = APP_ENV.LOG_LEVEL as LoggerLevel || 'info';
const logger = ClientLogger.create(appName, { level: logLevel });

export { logger };