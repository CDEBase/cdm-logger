# rokot-log

Rokot - [Rocketmakers](http://www.rocketmakers.com/) TypeScript NodeJs Platform

## Introduction

A typescript library for Logging.

This library extends the `bunyan` npm with factories to create Logger instances:

1. ConsoleLogger - create a Console logger
2. LogstashAmqpLogger - create a Logstash feed via Amqp

## Getting Started

### Installation
Install via `npm`
```
npm i rokot-log --save
```

## Example: Logstash Amqp

```typescript
import {LogstashAmqpLogger,Logger,ILogstashAmqpLoggerSettings} from "rokot-log";

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
import {ConsoleLogger,Logger,IConsoleLoggerSettings} from "rokot-log";

const settings: IConsoleLoggerSettings = {
  level: "info", // Optional: default 'info' ('trace'|'info'|'debug'|'warn'|'error'|'fatal')
  mode: "short" // Optional: default 'short' ('short'|'long'|'dev'|'raw')
}

const logger: Logger = ConsoleLogger.create("<app name>", settings);

// or create a logger with default values (in 'short' mode and at 'info' level)
const defaultLogger: Logger = ConsoleLogger.create("<app name>");

// Register 'logger' with IoC
```



## Consumed Libraries

### [bunyan](https://github.com/trentm/node-bunyan)
Bunyan Logger


## Contributing

### Getting started

Install `node_modules` via `npm`
```
npm i
```

Install `typings`
```
typings install
```

Build the project (using typescript compiler)
```
npm run build
```
