import { FileLogger } from '@cdm-logger/server';
import * as variables from './variables';
import * as os from 'os';


const appPath = variables.getAppData(os.platform);
const logPath = `${appPath}/logs`
const nameAndVersion = variables.getNameAndVersion();
const appName = nameAndVersion.name;
export const logger = FileLogger.create(appName, { logPath });

export const getLogger = (name: string) => FileLogger.create(name, { logPath });