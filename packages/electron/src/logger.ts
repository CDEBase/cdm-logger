import { CdmLogger } from '@cdm-logger/core';
import { FileLogger } from '@cdm-logger/server';
import * as Logger from 'bunyan';
import * as variables from './variables';


const appName = process.env.APP_NAME || 'CDM_APP';

export const logger = ConsoleLogger.create(appName, settings);