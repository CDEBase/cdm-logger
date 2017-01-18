import * as Logger from "bunyan";
import {ILoggerSettings,makeLogger,getSettingsLevel} from "./core";

var PrettyStream = require('bunyan-prettystream');

export interface IConsoleLoggerSettings extends ILoggerSettings {
  /** defaults to short */
  mode?: "short" | "long" | "dev" | "raw";
}

export function getConsoleStream(settings?: IConsoleLoggerSettings): Logger.Stream {
  if (!settings) {
    settings = {};
  }

  if (settings.mode === "raw") {
    return {
      level: getSettingsLevel(settings),
      stream: process.stdout
    }
  }

  const prettyStdOut = new PrettyStream({ mode: settings.mode || "short" });
  prettyStdOut.pipe(process.stdout);
  return {
    level: getSettingsLevel(settings),
    stream: prettyStdOut
  }
}

export class ConsoleLogger {
  static create(name: string, settings?: IConsoleLoggerSettings) {
    return makeLogger(name, getConsoleStream(settings));
  }
}
