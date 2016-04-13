import * as bunyan from "bunyan";

export interface ILoggerFactory {
  create(): bunyan.Logger;
}

export type LoggerLevel = "trace"|"debug"|"info"|"warn"|"error"|"fatal";

export interface ILoggerSettings {
  /** defaults to INFO */
  level?: LoggerLevel;
}

export function getSettingsLevel(settings: ILoggerSettings) {
  return settings.level || "info";
}

export function makeLogger(name: string, ...streams: bunyan.Stream[]): bunyan.Logger {
  return bunyan.createLogger(getLoggerOptions(name, ...streams));
}

export function getLoggerOptions(name: string, ...streams: bunyan.Stream[]): bunyan.LoggerOptions {
  if (!name) {
    throw Error("Cannot create LoggerOptions without a log name")
  }
  const options: bunyan.LoggerOptions = {
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
