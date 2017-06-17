// import { getLoggerOptions, makeLogger } from '@cdm-logger/core'
// import {createLogger} from "bunyan";
// import * as Logger from 'bunyan'
// import { ClientLogger } from '../clientLogger'

// function testLogger(logger: Logger, msg: string) {
//   logger.trace(msg);
//   logger.debug(msg);
//   logger.info(msg);
//   logger.warn(msg);
//   logger.error(msg);
//   logger.fatal(msg);
// }

// import { expect } from 'chai'

// function createMultiLogger(name: string | Object, settings1: any, settings2: any) {
//   return makeLogger(name, getConsoleStream(settings1), getConsoleStream(settings2));
// }

// describe("Client Logger", () => {
//   it("should be able to create a TRACE instance", () => {
//     const settings = {
//       mode:"long",
//       level: "trace"
//     }

//     const logger: Logger = ClientLogger.create("TestLog", settings);
//     expect(logger).to.be.not.undefined;
//     expect(logger).to.be.not.null;
//     testLogger(logger, settings.level)
//   });

//   it("should be able to create an instance without settings", () => {
//     const logger: Logger = ClientLogger.create("TestLog");
//     expect(logger).to.be.not.undefined;
//     expect(logger).to.be.not.null;
//     testLogger(logger, "INFO")
//   });

//   it("should be able to create an instance with 2 streams at different levels", () => {
//     const logger: Logger = createMultiLogger("TestLog", {mode: "long", level: "trace"}, {mode: "short", level: "warn"});
//     expect(logger).to.be.not.undefined;
//     expect(logger).to.be.not.null;
//     testLogger(logger, "long/trace + short/warn")
//   });

//   it("should be able to create an instance with 2 streams at different levels", () => {
//     const logger: Logger = createMultiLogger("TestLog", {mode: "long", level: "warn"}, {mode: "short", level: "trace"});
//     expect(logger).to.be.not.undefined;
//     expect(logger).to.be.not.null;
//     testLogger(logger, "long/warn + short/trace")
//   });
// })