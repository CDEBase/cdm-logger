import {expect,sinon,supertest} from "rokot-test";
import {ConsoleLogger,Logger, IConsoleLoggerSettings,getConsoleStream, getLoggerOptions, createLogger, makeLogger, LogstashAmqpLogger} from "../index";

function testLogger(logger: Logger, msg: string) {
  logger.trace(msg);
  logger.debug(msg);
  logger.info(msg);
  logger.warn(msg);
  logger.error(msg);
  logger.fatal(msg);
}

describe("Logstash Amqp Logger", () => {
  it("should be able to create a TRACE instance", () => {
    const logger = LogstashAmqpLogger.create("api", { host: "127.0.0.1", port: 5672, exchange: "logs", level: "trace"}, {
      level: "warn",
      mode: "short"
    });

    expect(logger).to.be.not.undefined;
    expect(logger).to.be.not.null;
    testLogger(logger, "trace + warn")
  });
})

describe("getLoggerOptions", () => {
  it("should be able to getLoggerOptions with no streams", () => {
    const options = getLoggerOptions("TestLog");
    expect(options).to.be.not.undefined;
    expect(options).to.be.not.null;
    expect(options.streams).to.be.undefined;
    expect(options.name).to.be.eq("TestLog", "should have name provided");
    testLogger(createLogger(options), "Raw Helllo")
  });

  it("should be able to getLoggerOptions with 1 stream", () => {
    const settings: IConsoleLoggerSettings = {
      mode:"long",
      level: "warn"
    }

    const options = getLoggerOptions("TestLog", getConsoleStream(settings));
    expect(options).to.be.not.undefined;
    expect(options).to.be.not.null;
    expect(options.streams.length).to.be.eq(1, "1 stream expected");
    expect(options.name).to.be.eq("TestLog", "should have name provided");
    testLogger(createLogger(options), settings.level)
  });

  it("should be able to getLoggerOptions with default level of INFO - short mode", () => {
    const settings: IConsoleLoggerSettings = {
      mode:"short"
    }

    const options = getLoggerOptions("TestLog", getConsoleStream(settings));
    expect(options).to.be.not.undefined;
    expect(options).to.be.not.null;
    expect(options.streams.length).to.be.eq(1, "1 streams expected");
    expect(options.name).to.be.eq("TestLog", "should have name provided");
    testLogger(createLogger(options), "INFO")
  });

  it("should be able to getLoggerOptions with default level of INFO - dev mode", () => {
    const settings: IConsoleLoggerSettings = {
      mode:"dev"
    }

    const options = getLoggerOptions("TestLog", getConsoleStream(settings));
    expect(options).to.be.not.undefined;
    expect(options).to.be.not.null;
    expect(options.streams.length).to.be.eq(1, "1 streams expected");
    expect(options.name).to.be.eq("TestLog", "should have name provided");
    testLogger(createLogger(options), "INFO")
  });

  it("should be able to getLoggerOptions with multiple console streams", () => {
    const options = getLoggerOptions(
      "TestLog",
      getConsoleStream({
        mode:"long",
        level:"trace"
      }),
      getConsoleStream({
        mode:"raw",
        level:"warn"
      }),
      getConsoleStream({
        mode:"short",
        level: "fatal"
      })
    );
    expect(options).to.be.not.undefined;
    expect(options).to.be.not.null;
    expect(options.streams.length).to.be.eq(3, "3 streams expected");
    expect(options.name).to.be.eq("TestLog", "should have name provided");
    testLogger(createLogger(options), "1:TRACE 2:WARN 3:FATAL")
  });

  it("should not be able to getLoggerOptions with name undefined, null or empty", () => {
    expect(() => getLoggerOptions("", getConsoleStream())).to.throw(Error);
    expect(() => getLoggerOptions(null, getConsoleStream())).to.throw(Error);
    expect(() => getLoggerOptions(undefined, getConsoleStream())).to.throw(Error);
  });

})

function createMultiLogger(name: string, settings1: IConsoleLoggerSettings, settings2: IConsoleLoggerSettings) {
  return makeLogger(name, getConsoleStream(settings1), getConsoleStream(settings2));
}

describe("Console Logger", () => {
  it("should be able to create a TRACE instance", () => {
    const settings: IConsoleLoggerSettings = {
      mode:"long",
      level: "trace"
    }

    const logger: Logger = ConsoleLogger.create("TestLog", settings);
    expect(logger).to.be.not.undefined;
    expect(logger).to.be.not.null;
    testLogger(logger, settings.level)
  });

  it("should be able to create an instance without settings", () => {
    const logger: Logger = ConsoleLogger.create("TestLog");
    expect(logger).to.be.not.undefined;
    expect(logger).to.be.not.null;
    testLogger(logger, "INFO")
  });

  it("should be able to create an instance with 2 streams at different levels", () => {
    const logger: Logger = createMultiLogger("TestLog", {mode: "long", level: "trace"}, {mode: "short", level: "warn"});
    expect(logger).to.be.not.undefined;
    expect(logger).to.be.not.null;
    testLogger(logger, "long/trace + short/warn")
  });

  it("should be able to create an instance with 2 streams at different levels", () => {
    const logger: Logger = createMultiLogger("TestLog", {mode: "long", level: "warn"}, {mode: "short", level: "trace"});
    expect(logger).to.be.not.undefined;
    expect(logger).to.be.not.null;
    testLogger(logger, "long/warn + short/trace")
  });
})
