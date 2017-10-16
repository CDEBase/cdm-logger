import { getLoggerOptions, makeLogger } from '@cdm-logger/core'
import { createLogger } from "bunyan";
import * as Logger from 'browser-bunyan'
import { ClientLogger, getConsoleStream } from '../client-logger'
import { ILoggerSettings } from '../interfaces';
import 'jest'

function testLogger(logger: Logger, msg: string) {
  logger.trace(msg);
  logger.debug(msg);
  logger.info(msg);
  logger.warn(msg);
  logger.error(msg);
  logger.fatal(msg);
}

function createMultiLogger(name: string | Object, settings1: any, settings2: any) {
  return makeLogger(name, getConsoleStream(settings1), getConsoleStream(settings2));
}

describe("Client Logger", () => {
  it("should be able to create a TRACE instance", () => {
    const settings: ILoggerSettings = {
      level: "trace"
    }

    const logger: Logger = ClientLogger.create("TestLog", settings);
    expect(logger).not.toBeUndefined;
    expect(logger).not.toBeNull;
    testLogger(logger, settings.level)
  });

  it("should be able to create an instance without settings", () => {
    const logger: Logger = ClientLogger.create("TestLog");
    expect(logger).not.toBeUndefined;
    expect(logger).not.toBeNull;
    testLogger(logger, "INFO")
  });

  // it("should be able to create an instance with 2 streams at different levels", () => {
  //   const logger: Logger = createMultiLogger("TestLog", { level: "trace" }, { level: "warn" });
  //   expect(logger).not.toBeUndefined;
  //   expect(logger).not.toBeNull;
  //   testLogger(logger, "long/trace + short/warn")
  // });

  // it("should be able to create an instance with 2 streams at different levels", () => {
  //   const logger: Logger = createMultiLogger("TestLog", { level: "warn" }, { level: "trace" });
  //   expect(logger).not.toBeUndefined;
  //   expect(logger).not.toBeNull;
  //   testLogger(logger, "long/warn + short/trace")
  // });
})