import { ClientLogger } from './client-logger';
import { LoggerLevel } from './interfaces';
import { getEnvironment } from './utils/getEnvironment';

const APP_ENV = getEnvironment(); 
const appName = APP_ENV.APP_NAME || 'FullStack';
const logLevel: LoggerLevel = APP_ENV.LOG_LEVEL as LoggerLevel || 'info';
const logger = ClientLogger.create(appName, { level: logLevel });

export { logger };