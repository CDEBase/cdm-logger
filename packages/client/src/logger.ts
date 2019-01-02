import { ClientLogger } from './client-logger';
import { LoggerLevel } from './interfaces';

const appName = (process && process.env && process.env.APP_NAME) || 'FullStack';
const logLevel: LoggerLevel = (process && process.env && process.env.LOG_LEVEL) as LoggerLevel|| 'info';
const logger = ClientLogger.create(appName, { level: logLevel });

export { logger };