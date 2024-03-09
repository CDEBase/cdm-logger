import * as Logger from 'bunyan';
import {ILoggerSettings,makeLogger,getSettingsLevel, CdmLogger } from '@cdm-logger/core';
import PrettyStream from 'bunyan-prettystream-circularsafe';

export interface IConsoleLoggerSettings extends ILoggerSettings {
  /** defaults to short */
  mode?: 'short' | 'long' | 'dev' | 'raw';
}

export function getConsoleStream(settings?: IConsoleLoggerSettings): CdmLogger.Stream {
  if (!settings) {
    settings = {};
  }

  if (settings.mode === 'raw') {
    return {
      level: getSettingsLevel(settings),
      stream: process.stdout
    }
  }

  const prettyStdOut = new PrettyStream({ mode: settings.mode || 'short' });
  prettyStdOut.pipe(process.stdout);
  return {
    level: getSettingsLevel(settings),
    stream: prettyStdOut
  }
}

export class ConsoleLogger {
  static create(name: string | Object, settings?: IConsoleLoggerSettings) {
    return makeLogger(Logger, name, getConsoleStream(settings) as any);
  }
}
