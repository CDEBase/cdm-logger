/*
 * Based on https://github.com/moleculerjs/moleculer/blob/master/src/loggers/pino.js
 */

const BaseLogger = require("moleculer").Loggers.Base;
import { ConsoleLogger } from '../console-logger';

/**
 * CDM Logger for Moleculer
 * 
 * @class CdmMoleculerLogger
 * @extends {BaseLogger}
 */
class CdmMoleculerLogger extends BaseLogger {
	/**
	 * Creates an instance of CdmMoleculerLogger.
	 * @param {Object} opts
	 * @memberof CdmMoleculerLogger
	 */
	constructor(opts) {
		super(opts);

		this.opts = opts || {};

		// Define log levels - mapping Moleculer levels to CDM levels
		this.logLevels = {
			fatal: "fatal",
			error: "error",
			warn: "warn",
			info: "info",
			debug: "debug",
			trace: "trace"
		};

		// Create CDM logger instance
		this.cdmLogger = this.opts.cdmLogger || ConsoleLogger.create(this.opts.name || "moleculer");
	}

	/**
	 * Initialize logger.
	 * @param {Object} loggerFactory
	 */
	init(loggerFactory) {
		super.init(loggerFactory);
		
		// Cache child loggers by module
		this.childLoggers = new Map();
	}

	/**
	 * Get a child logger for a module.
	 * @param {Object} bindings
	 * @returns {Function}
	 */
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
			// Ensure args is not empty
			if (!args || args.length === 0) {
				args = [""];
			}

			// Get the mapped log level or default to info
			const mappedLevel = this.logLevels[level] || "info";

			// Route log to appropriate method based on level
			switch (mappedLevel) {
				case "trace": child.trace(args[0], ...args.slice(1)); break;
				case "debug": child.debug(args[0], ...args.slice(1)); break;
				case "info": child.info(args[0], ...args.slice(1)); break;
				case "warn": child.warn(args[0], ...args.slice(1)); break;
				case "error": child.error(args[0], ...args.slice(1)); break;
				case "fatal": child.fatal(args[0], ...args.slice(1)); break;
				default: child.info(args[0], ...args.slice(1));
			}
		};
	}

	/**
	 * Get current CDM logger instance
	 * @returns {Object}
	 */
	getCdmLogger() {
		return this.cdmLogger;
	}
}

// Export for ES modules
export default CdmMoleculerLogger; 