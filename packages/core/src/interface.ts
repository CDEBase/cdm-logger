import { EventEmitter } from "events";
import type { LevelWithSilentOrString, LoggerExtras } from 'pino';

export type LogLevelString =
  | "trace"
  | "debug"
  | "info"
  | "warn"
  | "error"
  | "fatal";
export type LoggerLevel = LogLevelString | number;
export type LevelWithSilent = LoggerLevel | "silent";

export type ChildLoggerOptions = {
  [key: string]: string;
  childName?: string;

}
export interface BaseLogger extends EventEmitter {
  /**
   * Holds the current log format version (as output in the v property of each log record).
   */
  readonly LOG_VERSION?: number;
  /**
   * Exposes the Pino package version. Also available on the exported pino function.
   */
  readonly version?: string;

  // levels: LevelMapping;

  /**
   * Set this property to the desired logging level. In order of priority, available levels are:
   *
   * - 'fatal'
   * - 'error'
   * - 'warn'
   * - 'info'
   * - 'debug'
   * - 'trace'
   *
   * The logging level is a __minimum__ level. For instance if `logger.level` is `'info'` then all `'fatal'`, `'error'`, `'warn'`,
   * and `'info'` logs will be enabled.
   *
   * You can pass `'silent'` to disable logging.
   */
  // level: LevelWithSilent | string;
  /**
   * Outputs the level as a string instead of integer.
   */
  // useLevelLabels: boolean;
  /**
   * Define additional logging levels.
   */
  // customLevels: { [key: string]: number };
  /**
   * Use only defined `customLevels` and omit Pino's levels.
   */
  // useOnlyCustomLevels: boolean;
  /**
   * Returns the integer value for the logger instance's logging level.
   */
  levelVal?: number;

  addStream(stream: Stream): void;
  addSerializers(serializers: Serializers): void;

  /**
   * Creates a child logger, setting all key-value pairs in `bindings` as properties in the log lines. All serializers will be applied to the given pair.
   * Child loggers use the same output stream as the parent and inherit the current log level of the parent at the time they are spawned.
   * From v2.x.x the log level of a child is mutable (whereas in v1.x.x it was immutable), and can be set independently of the parent.
   * If a `level` property is present in the object passed to `child` it will override the child logger level.
   *
   * @param bindings: an object of key-value pairs to include in log lines as properties.
   * @returns a child logger instance.
   */
  child(options: ChildLoggerOptions, simple?: boolean): ILogger;

  /**
   * Log at `'fatal'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
   * If more args follows `msg`, these will be used to format `msg` using `util.format`.
   *
   * @typeParam T: the interface of the object being serialized. Default is object.
   * @param obj: object to be serialized
   * @param msg: the log message to write
   * @param ...args: format string values when `msg` is a format string
   */
  fatal: LogFn;
  /**
   * Log at `'error'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
   * If more args follows `msg`, these will be used to format `msg` using `util.format`.
   *
   * @typeParam T: the interface of the object being serialized. Default is object.
   * @param obj: object to be serialized
   * @param msg: the log message to write
   * @param ...args: format string values when `msg` is a format string
   */
  error: LogFn;
  /**
   * Log at `'warn'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
   * If more args follows `msg`, these will be used to format `msg` using `util.format`.
   *
   * @typeParam T: the interface of the object being serialized. Default is object.
   * @param obj: object to be serialized
   * @param msg: the log message to write
   * @param ...args: format string values when `msg` is a format string
   */
  warn: LogFn;
  /**
   * Log at `'info'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
   * If more args follows `msg`, these will be used to format `msg` using `util.format`.
   *
   * @typeParam T: the interface of the object being serialized. Default is object.
   * @param obj: object to be serialized
   * @param msg: the log message to write
   * @param ...args: format string values when `msg` is a format string
   */
  info: LogFn;
  /**
   * Log at `'debug'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
   * If more args follows `msg`, these will be used to format `msg` using `util.format`.
   *
   * @typeParam T: the interface of the object being serialized. Default is object.
   * @param obj: object to be serialized
   * @param msg: the log message to write
   * @param ...args: format string values when `msg` is a format string
   */
  debug: LogFn;
  /**
   * Log at `'trace'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
   * If more args follows `msg`, these will be used to format `msg` using `util.format`.
   *
   * @typeParam T: the interface of the object being serialized. Default is object.
   * @param obj: object to be serialized
   * @param msg: the log message to write
   * @param ...args: format string values when `msg` is a format string
   */
  trace: LogFn;
  /**
   * Noop function.
   */
  silent?: LogFn;

  /**
   * Flushes the content of the buffer in extreme mode. It has no effect if extreme mode is not enabled.
   */
  flush?(): void;

  /**
   * A utility method for determining if a given log level will write to the destination.
   */
  isLevelEnabled?(level: LevelWithSilent | string): boolean;

  /**
   * Returns an object containing all the current bindings, cloned from the ones passed in via logger.child().
   */
  bindings?(): Bindings;
}

export interface LevelMapping {
  /**
   * Returns the mappings of level names to their respective internal number representation.
   */
  values: { [level: string]: number };
  /**
   * Returns the mappings of level internal level numbers to their string representations.
   */
  labels: { [level: number]: string };
}
export type SerializerFn = (value: any) => any;

export interface Bindings {
  level?: LoggerLevel | string;
  serializers?: { [key: string]: SerializerFn };
  [key: string]: any;
}

export interface LogFn {
  /* tslint:disable:no-unnecessary-generics */
  <T extends object>(obj: T, msg?: string, ...args: any[]): void;
  (msg: string, ...args: any[]): void;
  (error: Error, ...args: any[]): void;
}

export type ILogger = BaseLogger & { [key: string]: any };

export interface Serializers {
  [key: string]: SerializerFn;
}
export interface LoggerOptions {
  name?: string;
  level?: LevelWithSilentOrString;
  dest?: string;
  serializers?: Serializers;
  [custom: string]: any;
}

export interface Stream {
  type?: string;
  level?: LoggerLevel;
  path?: string;
  stream?: NodeJS.WritableStream | Stream;
  closeOnExit?: boolean;
  period?: string;
  count?: number;
  name?: string;
  reemitErrorEvents?: boolean;
}
