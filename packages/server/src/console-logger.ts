import Logger from 'pino';
import { ILoggerSettings, makeLogger, getSettingsLevel } from '@cdm-logger/core';

export interface IConsoleLoggerSettings extends ILoggerSettings {
  /** defaults to short */
  mode?: 'short' | 'long' | 'dev' | 'raw';
}

export function getConsoleStream(settings?: IConsoleLoggerSettings) {
  if (!settings) {
    settings = {};
  }

  if (settings.mode === 'raw') {
    return {
      level: getSettingsLevel(settings),
      stream: process.stdout,
    }
  }

  return {
    level: getSettingsLevel(settings),
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    },
    stream: process.stdout,
  }
}

export class ConsoleLogger {
  static create(name: string | Object, settings?: IConsoleLoggerSettings) {
    return makeLogger(Logger, name, getConsoleStream(settings) as any);
  }
}
