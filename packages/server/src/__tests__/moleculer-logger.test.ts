import { describe, it, expect, vi, beforeEach } from 'vitest';
import CdmMoleculerLogger from '../adapters/moleculer-logger';

// Mock Moleculer's BaseLogger
vi.mock('moleculer', () => ({
  Loggers: {
    Base: class MockBaseLogger {
      constructor() {}
      init() {}
    }
  }
}));

describe('CdmMoleculerLogger', () => {
  let mockCdmLogger: any;
  let childLogger: any;
  
  beforeEach(() => {
    // Create a mock CDM logger
    childLogger = {
      trace: vi.fn(),
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      fatal: vi.fn()
    };
    
    mockCdmLogger = {
      trace: vi.fn(),
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      fatal: vi.fn(),
      child: vi.fn().mockReturnValue(childLogger)
    };
  });

  it('should create an instance with options', () => {
    const logger = new CdmMoleculerLogger({
      name: 'test-logger',
      cdmLogger: mockCdmLogger
    });
    
    expect(logger).toBeDefined();
    expect(logger.opts.name).toBe('test-logger');
    expect(logger.cdmLogger).toBe(mockCdmLogger);
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

  it('should initialize and create childLoggers map', () => {
    const logger = new CdmMoleculerLogger({
      cdmLogger: mockCdmLogger
    });
    
    logger.init({});
    
    expect(logger.childLoggers).toBeDefined();
    expect(logger.childLoggers instanceof Map).toBe(true);
  });

  it('should create a child logger for each unique binding', () => {
    const logger = new CdmMoleculerLogger({
      cdmLogger: mockCdmLogger
    });
    
    logger.init({});
    
    // First call should create a new child logger
    logger.getLogHandler({ nodeID: 'node1', mod: 'module1' });
    expect(mockCdmLogger.child).toHaveBeenCalledWith({
      nodeID: 'node1',
      module: 'module1'
    });
    
    // Reset call count
    mockCdmLogger.child.mockClear();
    
    // Second call with the same binding should reuse the child logger
    logger.getLogHandler({ nodeID: 'node1', mod: 'module1' });
    expect(mockCdmLogger.child).toHaveBeenCalledTimes(0);
    
    // Different binding should create a new child logger
    logger.getLogHandler({ nodeID: 'node1', mod: 'module2' });
    expect(mockCdmLogger.child).toHaveBeenCalledWith({
      nodeID: 'node1',
      module: 'module2'
    });
  });

  it('should route log messages to the appropriate level method', () => {
    const logger = new CdmMoleculerLogger({
      cdmLogger: mockCdmLogger
    });
    
    logger.init({});
    
    // Get a log handler
    const handler = logger.getLogHandler({ nodeID: 'node1', mod: 'module1' });
    
    // Test each level
    handler('trace', ['Trace message']);
    expect(childLogger.trace).toHaveBeenCalledWith('Trace message');
    
    handler('debug', ['Debug message']);
    expect(childLogger.debug).toHaveBeenCalledWith('Debug message');
    
    handler('info', ['Info message']);
    expect(childLogger.info).toHaveBeenCalledWith('Info message');
    
    handler('warn', ['Warning message']);
    expect(childLogger.warn).toHaveBeenCalledWith('Warning message');
    
    handler('error', ['Error message']);
    expect(childLogger.error).toHaveBeenCalledWith('Error message');
    
    handler('fatal', ['Fatal message']);
    expect(childLogger.fatal).toHaveBeenCalledWith('Fatal message');
    
    // Unknown level should default to info
    handler('unknown', ['Unknown message']);
    expect(childLogger.info).toHaveBeenCalledWith('Unknown message');
  });

  it('should handle empty args array', () => {
    const logger = new CdmMoleculerLogger({
      cdmLogger: mockCdmLogger
    });
    
    logger.init({});
    
    // Get a log handler
    const handler = logger.getLogHandler({ nodeID: 'node1', mod: 'module1' });
    
    // Call with empty args
    handler('info', []);
    expect(childLogger.info).toHaveBeenCalledWith('');
  });

  it('should use log level mapping to route messages', () => {
    const logger = new CdmMoleculerLogger({
      cdmLogger: mockCdmLogger
    });
    
    logger.init({});
    
    // Override log levels to test mapping
    logger.logLevels = {
      fatal: "error", // Route fatal to error
      error: "warn",  // Route error to warn
      warn: "info",   // Route warn to info
      info: "debug",  // Route info to debug
      debug: "trace", // Route debug to trace
      trace: "trace"  // Keep trace as trace
    };
    
    // Get a log handler
    const handler = logger.getLogHandler({ nodeID: 'node1', mod: 'module1' });
    
    // Test mapping
    handler('fatal', ['Fatal message']);
    expect(childLogger.error).toHaveBeenCalledWith('Fatal message');
    
    handler('error', ['Error message']);
    expect(childLogger.warn).toHaveBeenCalledWith('Error message');
    
    handler('warn', ['Warning message']);
    expect(childLogger.info).toHaveBeenCalledWith('Warning message');
    
    handler('info', ['Info message']);
    expect(childLogger.debug).toHaveBeenCalledWith('Info message');
    
    handler('debug', ['Debug message']);
    expect(childLogger.trace).toHaveBeenCalledWith('Debug message');
    
    handler('trace', ['Trace message']);
    expect(childLogger.trace).toHaveBeenCalledWith('Trace message');
  });

  it('should return the CDM logger when getCdmLogger is called', () => {
    const logger = new CdmMoleculerLogger({
      cdmLogger: mockCdmLogger
    });
    
    expect(logger.getCdmLogger()).toBe(mockCdmLogger);
  });
}); 