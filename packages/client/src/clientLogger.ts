import * as Logger from "bunyan";
import { ILoggerSettings, makeLogger, getSettingsLevel } from "@cdm-logger/core";

export interface IClientLoggerSettings extends ILoggerSettings {
  /** defaults to short */
  mode?: "short" | "long" | "dev" | "raw";
}
class MyRawStream {

    constructor(opts) {

    }
    public write(rec) {
        if (!rec) {
            return undefined;
        }
        var recObj;
        if (rec instanceof Object) {
            recObj = rec;
        } else {
            recObj = JSON.parse(rec);
        }
        console.log('[%s] %s: %s',
            recObj.time,
            [recObj.level],
            recObj.msg);
    }
}

export function getConsoleStream(settings?: IClientLoggerSettings): Logger.Stream {
    if (!settings) {
        settings = {};
    }

    if (settings.mode === "raw") {
        return {
            level: getSettingsLevel(settings),
            stream: process.stdout
        }
    }

    const rawStream = new MyRawStream({ mode: settings.mode || "short" });
    return {
        level: getSettingsLevel(settings),
        stream: rawStream
    }
}

export class ClientLogger {
    static create(name: string | Object, settings?: IClientLoggerSettings) {
        return makeLogger(name, getConsoleStream(settings));
    }
}
