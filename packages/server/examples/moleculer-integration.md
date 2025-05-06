# Using CDM Logger with Moleculer

This example demonstrates how to integrate `@cdm-logger/server` with Moleculer services, similar to Moleculer's built-in Pino logger.

## Basic Usage

```javascript
// moleculer.config.js
const { CdmMoleculerLogger } = require('@cdm-logger/server/moleculer');

module.exports = {
    logger: new CdmMoleculerLogger(),
    // ... other Moleculer configurations
};
```

## With Custom Options

```javascript
// moleculer.config.js
const { CdmMoleculerLogger } = require('@cdm-logger/server/moleculer');
const { ConsoleLogger } = require('@cdm-logger/server');

// Create a custom CDM logger instance
const cdmLogger = ConsoleLogger.create('my-service', {
    level: 'debug',
    // other options...
});

module.exports = {
    logger: new CdmMoleculerLogger({
        cdmLogger,
        name: 'my-service'
    }),
    // ... other Moleculer configurations
};
```

## Implementation

The implementation is similar to Moleculer's built-in Pino logger (see [Moleculer's Pino Logger](https://github.com/moleculerjs/moleculer/blob/master/src/loggers/pino.js)) but uses CDM logger internally:

```javascript
const BaseLogger = require("moleculer").Loggers.Base;

class CdmMoleculerLogger extends BaseLogger {
    constructor(opts) {
        super(opts);

        this.opts = opts || {};
        // Create CDM logger instance
        this.cdmLogger = this.opts.cdmLogger || createDefaultLogger(this.opts.name || "moleculer");
    }

    init(loggerFactory) {
        super.init(loggerFactory);
        // Cache child loggers by module
        this.childLoggers = new Map();
    }

    getLogHandler(bindings) {
        // Create or retrieve a child logger
        const key = `${bindings.nodeID}-${bindings.mod}`;
        let child = this.childLoggers.get(key);
        if (!child) {
            child = this.cdmLogger.child({
                nodeID: bindings.nodeID,
                module: bindings.mod
            });
            this.childLoggers.set(key, child);
        }

        // Return log handler
        return (level, args) => {
            // Route log to appropriate method based on level
            switch (level) {
                case "trace": child.trace(...args); break;
                case "debug": child.debug(...args); break;
                case "info": child.info(...args); break;
                case "warn": child.warn(...args); break;
                case "error": child.error(...args); break;
                case "fatal": child.fatal(...args); break;
                default: child.info(...args);
            }
        };
    }
} 