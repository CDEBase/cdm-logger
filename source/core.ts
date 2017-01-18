import * as Logger from "bunyan";

export interface ILoggerFactory {
  create(): Logger;
}

export type LoggerLevel = "trace"|"debug"|"info"|"warn"|"error"|"fatal";

export interface ILoggerSettings {
  /** defaults to INFO */
  level?: LoggerLevel;
}

export function getSettingsLevel(settings: ILoggerSettings) {
  return settings.level || "info";
}

export function makeLogger(name: string, ...streams: Logger.Stream[]): Logger {
  return Logger.createLogger(getLoggerOptions(name, ...streams));
}

export function getLoggerOptions(name: string, ...streams: Logger.Stream[]): Logger.LoggerOptions {
  if (!name) {
    throw Error("Cannot create LoggerOptions without a log name")
  }
  const options: Logger.LoggerOptions = {
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
