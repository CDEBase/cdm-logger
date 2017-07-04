import 'reflect-metadata';
import { injectable, inject, Container } from 'inversify'
import { ConsoleLogger, IConsoleLoggerSettings, getConsoleStream } from "../index";
import { getLoggerOptions, makeLogger, BunyanOptions } from '@cdm-logger/core'
import { createLogger } from "bunyan";
import 'jest'
import * as Logger from 'bunyan'

function testLogger(logger: Logger, msg: string) {
  logger.trace(msg);
  logger.debug(msg);
  logger.info(msg);
  logger.warn(msg);
  logger.error(msg);
  logger.fatal(msg);
}

describe("getLoggerOptions", () => {
  it("should be able to getLoggerOptions with no streams", () => {
    const options = getLoggerOptions({ name: "TestLog", kind: "bunyan" });
    console.log(options)
    expect(options).not.toBeUndefined;
    expect(options).not.toBeNull;
    expect((options as BunyanOptions).streams).toBeUndefined;
    expect((options as BunyanOptions).name).toEqual("TestLog");
    testLogger(createLogger(options as Logger.LoggerOptions), "Raw Helllo")
  });

  // it("should be able to getLoggerOptions with 1 stream", () => {
  //   const settings: IConsoleLoggerSettings = {
  //     mode: "long",
  //     level: "warn",
  //   }

  //   const options = getLoggerOptions({ name: "TestLog", kind: "bunyan", streams: [getConsoleStream(settings)] });
  //   expect(options).not.toBeUndefined;
  //   expect(options).not.toBeNull;
  //   expect((options as BunyanOptions).streams.length).toEqual(1);
  //   expect((options as BunyanOptions).name).toEqual("TestLog");
  //   testLogger(createLogger(options as Logger.LoggerOptions), settings.level)
  // });

  // it("should be able to getLoggerOptions with default level of INFO - short mode", () => {
  //   const settings: IConsoleLoggerSettings = {
  //     mode: "short"
  //   }

  //   const options = getLoggerOptions("TestLog", getConsoleStream(settings));
  //   expect(options).not.toBeUndefined;
  //   expect(options).not.toBeNull;
  //   expect((options as BunyanOptions).streams.length).toEqual(1);
  //   expect((options as BunyanOptions).name).toEqual("TestLog");
  //   testLogger(createLogger(options), "INFO")
  // });

  // it("should be able to getLoggerOptions with default level of INFO - dev mode", () => {
  //   const settings: IConsoleLoggerSettings = {
  //     mode: "dev"
  //   }

  //   const options = getLoggerOptions("TestLog", getConsoleStream(settings));
  //   expect(options).not.toBeUndefined;
  //   expect(options).not.toBeNull;
  //   expect(options.(options as BunyanOptions).length).toEqual(1);
  //   expect((options as BunyanOptions).name).toEqual("TestLog");
  //   testLogger(createLogger(options), "INFO")
  // });

  // it("should be able to getLoggerOptions with multiple console streams", () => {
  //   const options = getLoggerOptions({
  //     kind: "bunyan",
  //     name: "TestLog",
  //     streams: [getConsoleStream({
  //       mode: "long",
  //       level: "trace"
  //     }),
  //     getConsoleStream({
  //       mode: "raw",
  //       level: "warn"
  //     }),
  //     getConsoleStream({
  //       mode: "short",
  //       level: "fatal"
  //     })]
  //   }
  //   );
  //   expect(options).not.toBeUndefined;
  //   expect(options).not.toBeNull;
  //   expect((options as BunyanOptions).streams.length).toEqual(3);
  //   expect((options as BunyanOptions).name).toEqual("TestLog");
  //   testLogger(createLogger(options), "1:TRACE 2:WARN 3:FATAL")
  // });

  // it("should not be able to getLoggerOptions with name undefined, null or empty", () => {
  //   expect(() => getLoggerOptions("", { kind: "bunyan" }, [getConsoleStream()])).toThrow(Error);
  //   expect(() => getLoggerOptions(null, getConsoleStream())).toThrow(Error);
  //   expect(() => getLoggerOptions(undefined, getConsoleStream())).toThrow(Error);
  // });

})

// function createMultiLogger(name: string | Object, settings1: IConsoleLoggerSettings, settings2: IConsoleLoggerSettings) {
//   return makeLogger(name, getConsoleStream(settings1), getConsoleStream(settings2));
// }

// describe("Console Logger", () => {
//   it("should be able to create a TRACE instance", () => {
//     const settings: IConsoleLoggerSettings = {
//       mode: "long",
//       level: "trace"
//     }

//     const logger: Logger = ConsoleLogger.create("TestLog", settings);
//     expect(logger).not.toBeUndefined;
//     expect(logger).not.toBeNull;
//     testLogger(logger, settings.level)
//   });

//   it("should be able to create an instance without settings", () => {
//     const logger: Logger = ConsoleLogger.create("TestLog");
//     expect(logger).not.toBeUndefined;
//     expect(logger).not.toBeNull;
//     testLogger(logger, "INFO")
//   });

//   it("should be able to create an instance with 2 streams at different levels", () => {
//     const logger: Logger = createMultiLogger("TestLog", { mode: "long", level: "trace" }, { mode: "short", level: "warn" });
//     expect(logger).not.toBeUndefined;
//     expect(logger).not.toBeNull;
//     testLogger(logger, "long/trace + short/warn")
//   });

//   it("should be able to create an instance with 2 streams at different levels", () => {
//     const logger: Logger = createMultiLogger("TestLog", { mode: "long", level: "warn" }, { mode: "short", level: "trace" });
//     expect(logger).not.toBeUndefined;
//     expect(logger).not.toBeNull;
//     testLogger(logger, "long/warn + short/trace")
//   });
// })

// describe("Console Logger using Constructor", () => {
//   class TestClass {

//   }
//   const instance = new TestClass();

//   it("should be able to create a TRACE instance", () => {
//     const settings: IConsoleLoggerSettings = {
//       mode: "long",
//       level: "trace"
//     }

//     const logger: Logger = ConsoleLogger.create(instance, settings);
//     expect(logger).not.toBeUndefined;
//     expect(logger).not.toBeNull;
//     testLogger(logger, settings.level)
//   });

//   it("should be able to create an instance without settings", () => {
//     const logger: Logger = ConsoleLogger.create(instance);
//     expect(logger).not.toBeUndefined;
//     expect(logger).not.toBeNull;
//     testLogger(logger, "INFO")
//   });

//   it("should be able to create an instance with 2 streams at different levels", () => {
//     const logger: Logger = createMultiLogger(instance, { mode: "long", level: "trace" }, { mode: "short", level: "warn" });
//     expect(logger).not.toBeUndefined;
//     expect(logger).not.toBeNull;
//     testLogger(logger, "long/trace + short/warn")
//   });

//   it("should be able to create an instance with 2 streams at different levels", () => {
//     const logger: Logger = createMultiLogger(instance, { mode: "long", level: "warn" }, { mode: "short", level: "trace" });
//     expect(logger).not.toBeUndefined;
//     expect(logger).not.toBeNull;
//     testLogger(logger, "long/warn + short/trace")
//   });
// })

// describe("Console Logger using inversify", () => {

//   @injectable()
//   class TestClass {
//     constructor( @inject("logger") private logger: Logger) {

//     }
//     test() {
//       this.logger.info("test")
//     }
//   }
//   const container = new Container();
//   const consoleLogger = ConsoleLogger.create("ioc")
//   container.bind<Logger>("logger").toConstantValue(consoleLogger)
//   container.bind<TestClass>("TestClass").to(TestClass)

//   it("should be able to create a TRACE instance", () => {

//     const testClass = container.get<TestClass>("TestClass")
//     testClass.test();
//   });

// })

// describe("Console Logger for child classes", () => {

//   @injectable()
//   class TestClass {
//     constructor( @inject("logger") private logger: Logger) {
//       this.logger = logger.child({ className: 'TestClass' })
//     }
//     test() {
//       this.logger.info("This is to test child logger.")
//     }
//   }
//   const container = new Container();
//   const consoleLogger = ConsoleLogger.create("ioc")
//   container.bind<Logger>("logger").toConstantValue(consoleLogger)
//   container.bind<TestClass>("TestClass").to(TestClass)

//   it("should be able to create a TRACE instance", () => {

//     const testClass = container.get<TestClass>("TestClass")
//     testClass.test();
//   });

// })
