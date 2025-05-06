import { describe, it, expect, vi } from 'vitest';
import CdmMoleculerLogger from '../adapters/moleculer-logger';
import { ConsoleLogger } from '../console-logger';

// Don't mock the BaseLogger so we can test the real implementation
// Only mock the console methods to avoid cluttering the test output
vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});
vi.spyOn(console, 'info').mockImplementation(() => {});
vi.spyOn(console, 'debug').mockImplementation(() => {});

describe('CdmMoleculerLogger', () => {
  // Create a real logger instance for testing
  const testLogger = ConsoleLogger.create('test-console');
  
  // Create a mock loggerFactory with the required broker.Promise property
  // This is what Moleculer's BaseLogger expects in its init method
  const mockLoggerFactory = {
    broker: {
      Promise: Promise
    }
  };
  
  it('should create an instance with default options', () => {
    const logger = new CdmMoleculerLogger({});
    
    expect(logger).toBeDefined();
    expect(logger.opts).toBeDefined();
    expect(logger.cdmLogger).toBeDefined();
    expect(logger.logLevels).toBeDefined();
    expect(logger.logLevels).toEqual({
      fatal: "fatal",
      error: "error",
      warn: "warn",
      info: "info",
      debug: "debug",
      trace: "trace"
    });
  });

  it('should create an instance with custom name', () => {
    const logger = new CdmMoleculerLogger({
      name: 'test-logger'
    });
    
    expect(logger).toBeDefined();
    expect(logger.opts.name).toBe('test-logger');
  });
  
  it('should create an instance with custom cdmLogger', () => {
    const logger = new CdmMoleculerLogger({
      cdmLogger: testLogger
    });
    
    expect(logger).toBeDefined();
    expect(logger.cdmLogger).toBe(testLogger);
  });

  it('should initialize without errors', () => {
    const logger = new CdmMoleculerLogger({});
    
    // This should not throw an error
    let error = null;
    try {
      logger.init(mockLoggerFactory);
    } catch (e) {
      error = e;
    }
    expect(error).toBeNull();
  });
  
  it('should create a map for child loggers', () => {
    const logger = new CdmMoleculerLogger({});
    logger.init(mockLoggerFactory);
    
    expect(logger.childLoggers).toBeDefined();
    expect(logger.childLoggers instanceof Map).toBe(true);
  });

  it('should return a log handler function from getLogHandler', () => {
    const logger = new CdmMoleculerLogger({});
    logger.init(mockLoggerFactory);
    
    const handler = logger.getLogHandler({ nodeID: 'node1', mod: 'module1' });
    
    expect(typeof handler).toBe('function');
  });
  
  it('should reuse the same child logger for the same bindings', () => {
    const logger = new CdmMoleculerLogger({});
    logger.init(mockLoggerFactory);
    
    // Create a spy to verify the child method is only called once
    const childSpy = vi.spyOn(logger.cdmLogger, 'child');
    
    // First call
    logger.getLogHandler({ nodeID: 'node1', mod: 'module1' });
    expect(childSpy).toHaveBeenCalledTimes(1);
    
    // Second call with the same binding should reuse the cached child logger
    logger.getLogHandler({ nodeID: 'node1', mod: 'module1' });
    expect(childSpy).toHaveBeenCalledTimes(1); // Still just one call
    
    // Different binding should create a new child logger
    logger.getLogHandler({ nodeID: 'node1', mod: 'module2' });
    expect(childSpy).toHaveBeenCalledTimes(2);
  });

  it('should allow overriding logLevels', () => {
    const logger = new CdmMoleculerLogger({});
    logger.init(mockLoggerFactory);
    
    // Original mapping
    expect(logger.logLevels.fatal).toBe('fatal');
    
    // Override log levels
    logger.logLevels = {
      fatal: "error", // Route fatal to error
      error: "warn",  // Route error to warn
      warn: "info",   // Route warn to info
      info: "debug",  // Route info to debug
      debug: "trace", // Route debug to trace
      trace: "trace"  // Keep trace as trace
    };
    
    expect(logger.logLevels.fatal).toBe('error');
    expect(logger.logLevels.error).toBe('warn');
    expect(logger.logLevels.warn).toBe('info');
    expect(logger.logLevels.info).toBe('debug');
    expect(logger.logLevels.debug).toBe('trace');
  });

  it('should return the CDM logger when getCdmLogger is called', () => {
    const logger = new CdmMoleculerLogger({});
    
    const cdmLogger = logger.getCdmLogger();
    expect(cdmLogger).toBeDefined();
    expect(typeof cdmLogger.info).toBe('function');
    expect(typeof cdmLogger.error).toBe('function');
    expect(typeof cdmLogger.debug).toBe('function');
    expect(typeof cdmLogger.warn).toBe('function');
    expect(typeof cdmLogger.trace).toBe('function');
    expect(typeof cdmLogger.fatal).toBe('function');
  });

  it('should create a child logger when child method is called', () => {
    const logger = new CdmMoleculerLogger({});
    
    // Create a spy to verify the child method is called
    const childSpy = vi.spyOn(logger.cdmLogger, 'child');
    
    // Call the child method
    const childLogger = logger.child({ service: 'test-service' });
    
    // Verify the child method was called with the right bindings
    expect(childSpy).toHaveBeenCalledWith({ service: 'test-service' });
    
    // Verify we got a logger back
    expect(childLogger).toBeDefined();
  });

  it('should delegate logger methods to cdmLogger', () => {
    const logger = new CdmMoleculerLogger({});
    
    // Create spies on the internal cdmLogger methods
    const traceSpy = vi.spyOn(logger.cdmLogger, 'trace');
    const debugSpy = vi.spyOn(logger.cdmLogger, 'debug');
    const infoSpy = vi.spyOn(logger.cdmLogger, 'info');
    const warnSpy = vi.spyOn(logger.cdmLogger, 'warn');
    const errorSpy = vi.spyOn(logger.cdmLogger, 'error');
    const fatalSpy = vi.spyOn(logger.cdmLogger, 'fatal');
    
    // Call the methods on the logger
    logger.trace('trace message', { data: 1 });
    logger.debug('debug message', { data: 2 });
    logger.info('info message', { data: 3 });
    logger.warn('warn message', { data: 4 });
    logger.error('error message', { data: 5 });
    logger.fatal('fatal message', { data: 6 });
    
    // Verify the methods were delegated to cdmLogger
    expect(traceSpy).toHaveBeenCalledWith('trace message', { data: 1 });
    expect(debugSpy).toHaveBeenCalledWith('debug message', { data: 2 });
    expect(infoSpy).toHaveBeenCalledWith('info message', { data: 3 });
    expect(warnSpy).toHaveBeenCalledWith('warn message', { data: 4 });
    expect(errorSpy).toHaveBeenCalledWith('error message', { data: 5 });
    expect(fatalSpy).toHaveBeenCalledWith('fatal message', { data: 6 });
  });
}); 