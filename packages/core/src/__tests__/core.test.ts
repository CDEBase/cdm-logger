import {getLoggerOptions, makeLogger} from "../index";
import * as Logger from 'bunyan'
import 'jest'

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
    const options = getLoggerOptions("TestLog");
    expect(options).not.toBeNull;
    expect(options).not.toBeUndefined;
    expect(options.streams).toBeUndefined;
    expect(options.name).toEqual("TestLog");
    testLogger(Logger.createLogger(options), "Raw Helllo")
  });
})
