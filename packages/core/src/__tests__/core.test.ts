import { getLoggerOptions, makeLogger, BunyanOptions, PinoOptions } from "../index";
import * as Logger from 'bunyan';
import * as Pino from 'pino';
import 'jest'

function testLogger(logger: Logger, msg: string) {
  logger.trace(msg);
  logger.debug(msg);
  logger.info(msg);
  logger.warn(msg);
  logger.error(msg);
  logger.fatal(msg);
}


describe("getLoggerOptions for bunyan", () => {
  it("should be able to getLoggerOptions with no streams", () => {
    const options = getLoggerOptions({ name: "TestLog", kind: "bunyan" });
    expect(options).not.toBeNull;
    expect(options).not.toBeUndefined;
    expect((options as BunyanOptions).streams).toBeUndefined;
    expect((options as BunyanOptions).name).toEqual("TestLog");
    testLogger(Logger.createLogger(options as Logger.LoggerOptions), "Raw Helllo")
  });
})

// describe("getLoggerOptions for pino", () => {
//   it("should be able to getLoggerOptions with no streams", () => {
//     const pionOptions: Pino.LoggerOptions = getLoggerOptions({ name: "TestLog", kind: "pino" } as PinoOptions);
//     expect(pionOptions).not.toBeNull;
//     expect(pionOptions).not.toBeUndefined;
//     expect((pionOptions as PinoOptions).streams).toBeUndefined;
//     expect((pionOptions as PinoOptions).name).toEqual("TestLog");
//     testLogger(Logger.createLogger(pionOptions as Pino.LoggerOptions), "Raw Helllo")
//   });
// })

