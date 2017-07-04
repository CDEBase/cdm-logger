import * as Logger from "bunyan";
import * as Pino from 'pino';
import * as stream from 'stream';

export interface ILoggerFactory {
  create(): Logger;
}

export type LoggerLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";
export type PinoAdditionalOptions = [Pino.LoggerOptions, stream.Writable | stream.Duplex | stream.Transform];

export interface ILoggerSettings {
  /** defaults to INFO */
  level?: LoggerLevel;
}
export interface PinoOptions {
  kind: "pino";
  name: string | Object;
  streams?: stream;
}
export interface BunyanOptions {
  kind: "bunyan";
  name: string | Object;
  streams?: Logger.Stream[];
}
export function getSettingsLevel(settings: ILoggerSettings) {
  return settings.level || "info";
}

export function makeLogger(options: BunyanOptions | PinoOptions): Logger | Pino.Logger {

  const logName = typeof name === "object" ? options.name.constructor.toString().match(/class ([\w|_]+)/)[1] : name;
  switch (options.kind) {
    case "pino": return Pino(<Pino.LoggerOptions | PinoAdditionalOptions>getLoggerOptions(options));
    case "bunyan": return Logger.createLogger(<Logger.LoggerOptions>getLoggerOptions(options));
  }
}

export function getLoggerOptions(options: BunyanOptions | PinoOptions): Logger.LoggerOptions | Pino.LoggerOptions | PinoAdditionalOptions {
  // if (!options.name) {
  //   throw Error("Cannot create LoggerOptions without a log name")
  // }
  console.log(options.kind);
  switch (options.kind) {
    case "pino": {
      const pinoOptions: Pino.LoggerOptions = {
        name,
        serializers: {
          err: err => {
            return <any>{
              message: err.message,
              name: err.name,
              stack: err.stack,
            };
          }
        }
      }
      if (options.streams) {
        return [pinoOptions, options.streams]
      }
      return pinoOptions;
    };
    case "bunyan": {
      const bunyanOptions: Logger.LoggerOptions = {
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
      if (options.streams && options.streams.length) {
        bunyanOptions.streams = options.streams;
      }
      return bunyanOptions;
    }
    default: throw new Error("Undefined Logger Kind");
  }

}
