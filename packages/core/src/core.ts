import type { LevelWithSilentOrString } from 'pino';
import * as CdmLogger from './interface';

export interface ILoggerFactory {
  create(): CdmLogger.ILogger;
}

export interface ILoggerSettings {
  /** defaults to INFO */
  level?: LevelWithSilentOrString;
}

export function getSettingsLevel(settings: ILoggerSettings) {
  return settings.level || "info";
}

export function makeLogger(logger: any, name: string | Object, options: CdmLogger.LoggerOptions = {}): CdmLogger.ILogger {
  const logName = typeof name === "object" ? name.constructor.toString().match(/class ([\w|_]+)/)[1] : name
  if (options.dest) {
    const destination = logger.destination(getLoggerOptions(logName, options));
    return logger(destination);
  }
  
  return logger(getLoggerOptions(logName, options));
}

export function getLoggerOptions(name: string, others: CdmLogger.LoggerOptions = {}): CdmLogger.LoggerOptions {
  if (!name) {
    throw Error("Cannot create LoggerOptions without a log name")
  }
  const options: CdmLogger.LoggerOptions = {
    name: name,
    ...others,
  }
  return options;
}
