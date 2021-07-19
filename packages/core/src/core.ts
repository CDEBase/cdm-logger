import { CdmLogger } from './interfaces';

export interface ILoggerFactory {
  create(): CdmLogger.ILogger;
}

export interface ILoggerSettings {
  /** defaults to INFO */
  level?: CdmLogger.LoggerLevel;
}

export function getSettingsLevel(settings: ILoggerSettings) {
  return settings.level || "info";
}

export function makeLogger(logger: any, name: string | Object, ...streams: CdmLogger.Stream[]): CdmLogger.ILogger {
  const logName = typeof name === "object" ? name.constructor.toString().match(/class ([\w|_]+)/)[1] : name
  return logger.createLogger(getLoggerOptions(logName, ...streams));
}

export function getLoggerOptions(name: string, ...streams: CdmLogger.Stream[]): CdmLogger.LoggerOptions {
  if (!name) {
    throw Error("Cannot create LoggerOptions without a log name")
  }
  const options: CdmLogger.LoggerOptions = {
    name: name,
    src: true,
    serializers: {
      err: err => {
        return <any>{
          message: err.message,
          name: err.name,
          stack: err.stack,
          code: err.code,
          signal: err.signal,
          internalMessage: err.internalMessage,
          errors: err.errors
        };
      }
    }
  }
  if (streams && streams.length) {
    options.streams = streams;
  }
  return options;;
}
