import { CdmLogger } from '@cdm-logger/core';
import { FileLogger } from '@cdm-logger/server';
import * as Logger from 'bunyan';
import * as variables from './variables';
import * as os from 'os';


const appPath = variables.getAppData(os.platform);
const nameAndVersion = variables.getNameAndVersion();
const appName = nameAndVersion.name;
export const logger = FileLogger.create(appName, { logPath: appName });
