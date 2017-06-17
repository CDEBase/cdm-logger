# @cdm-logger

TypeScript NodeJs Platform

## Introduction

A typescript library for Logging.

This library extends the `bunyan` npm with factories to create Logger instances:

1. @cdm-logger/server: ConsoleLogger - create a Console logger
2. @cdm-logger/amqp: LogstashAmqpLogger - create a Logstash feed via Amqp
3: @cdm-logger/client: ClientLogger - create a browser Console logger

## Getting Started

### Installation
Install via `npm`
```
npm i cdm-logger --save
```

## Example: Logstash Amqp

```typescript
import {LogstashAmqpLogger,Logger,ILogstashAmqpLoggerSettings} from "cdm-logger";

const settings: ILogstashAmqpLoggerSettings = {
  level: "info", // Optional: default 'info' ('trace'|'info'|'debug'|'warn'|'error'|'fatal')
  host: "localhost",
  port: 5672,
  exchange:"logs" // Optional: default 'logs'
}

//Optional additional Console Logger
const consoleSettings: IConsoleLoggerSettings = {
  level: "trace",
  mode: "short"
}

const logger: Logger = LogstashAmqpLogger.create("<app name>", settings, consoleSettings);


// Register 'logger' with IoC
```

## Example: Console

```typescript
import {ConsoleLogger,Logger,IConsoleLoggerSettings} from "@cdm-logger/server";

const settings: IConsoleLoggerSettings = {
  level: "info", // Optional: default 'info' ('trace'|'info'|'debug'|'warn'|'error'|'fatal')
  mode: "short" // Optional: default 'short' ('short'|'long'|'dev'|'raw')
}

const logger: Logger = ConsoleLogger.create("<app name>", settings);

// or create a logger with default values (in 'short' mode and at 'info' level)
const defaultLogger: Logger = ConsoleLogger.create("<app name>");

// or create a logger with instance of the class
const defaultLogger: Logger = ConsoleLogger.create(this);

// Register 'logger' with IoC
describe("Console Logger using inversify", () => {

  @injectable()
  class TestClass {
    constructor(@inject("logger") private logger: Logger) {

    }
    test() {
      this.logger.info("test")
    }
  }
  const container = new Container();
  const consoleLogger = ConsoleLogger.create("ioc")
  container.bind<Logger>("logger").toConstantValue(consoleLogger)
  container.bind<TestClass>("TestClass").to(TestClass)

  it("should be able to create a TRACE instance", () => {

    const testClass = container.get<TestClass>("TestClass")
    testClass.test();
  });

})
```

##

## Consumed Libraries

### [bunyan](https://github.com/trentm/node-bunyan)
Bunyan Logger


## Contributing

### Getting started

Install `node_modules` via `npm`
```
npm i
```

Build the project (using typescript compiler)
```
npm run lerna
```
