import * as Logger from 'bunyan'
import {LogstashAmqpLogger} from "../index";
import 'jest'

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

    expect(logger).not.toBeUndefined;
    expect(logger).not.toBeNull;
    testLogger(logger, "trace + warn")
  });
})

