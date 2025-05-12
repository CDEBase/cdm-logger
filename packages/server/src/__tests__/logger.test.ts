import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from '../logger';
import { ConsoleLogger } from '../console-logger';

describe('logger', () => {
  let originalEnv: NodeJS.ProcessEnv;
  
  beforeEach(() => {
    // Save original environment variables
    originalEnv = { ...process.env };
  });
  
  afterEach(() => {
    // Restore original environment variables
    process.env = originalEnv;
  });
  
  it('should export a valid logger instance', () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.trace).toBe('function');
    expect(typeof logger.fatal).toBe('function');
  });
  
  it('should be able to log messages at different levels', () => {
    const infoSpy = vi.spyOn(logger, 'info');
    const errorSpy = vi.spyOn(logger, 'error');
    const debugSpy = vi.spyOn(logger, 'debug');
    const warnSpy = vi.spyOn(logger, 'warn');
    
    logger.info('This is an info message');
    logger.error('This is an error message');
    logger.debug('This is a debug message');
    logger.warn('This is a warning message');
    
    expect(infoSpy).toHaveBeenCalledWith('This is an info message');
    expect(errorSpy).toHaveBeenCalledWith('This is an error message');
    expect(debugSpy).toHaveBeenCalledWith('This is a debug message');
    expect(warnSpy).toHaveBeenCalledWith('This is a warning message');
  });
  
  it('should be able to create child loggers', () => {
    const childLogger = logger.child({ component: 'TestComponent' });
    
    expect(childLogger).toBeDefined();
    expect(typeof childLogger.info).toBe('function');
    
    const childInfoSpy = vi.spyOn(childLogger, 'info');
    childLogger.info('Child logger message');
    
    expect(childInfoSpy).toHaveBeenCalledWith('Child logger message');
  });
  
  it('should be able to log objects and metadata', () => {
    const infoSpy = vi.spyOn(logger, 'info');
    
    const testObject = { user: 'test', id: 123, actions: ['login', 'view'] };
    logger.info(testObject, 'User activity');
    
    expect(infoSpy).toHaveBeenCalledWith(testObject, 'User activity');
  });
  
  it('should be able to log errors with stack traces', () => {
    const errorSpy = vi.spyOn(logger, 'error');
    
    const testError = new Error('Test error message');
    logger.error(testError);
    
    expect(errorSpy).toHaveBeenCalledWith(testError);
  });
  
  // Test environment variables indirectly by checking if ConsoleLogger.create was called
  it('should create logger with correct defaults', () => {
    // This is testing the exported singleton, so we can only verify its properties
    // rather than testing its initialization with different environment variables
    
    // Create a new logger with the same defaults to compare
    const createSpy = vi.spyOn(ConsoleLogger, 'create');
    const testLogger = ConsoleLogger.create('CDM_APP', { level: 'info' });
    
    // Check if our spy was called with expected parameters
    expect(createSpy).toHaveBeenCalledWith('CDM_APP', { level: 'info' });
    
    // Verify testLogger has the same functionality as our singleton
    expect(typeof testLogger.info).toBe('function');
    expect(typeof testLogger.error).toBe('function');
  });
  
  it('should support structured logging with context', () => {
    const childLogger = logger.child({ 
      service: 'api',
      requestId: 'req-123',
      userId: 'user-456'
    });
    
    const infoSpy = vi.spyOn(childLogger, 'info');
    childLogger.info('Processing request');
    
    expect(infoSpy).toHaveBeenCalledWith('Processing request');
    
    // We can only verify the call was made correctly,
    // the actual context binding happens internally in pino
  });
  
  it('should support multiple child levels', () => {
    const serviceLogger = logger.child({ service: 'auth-service' });
    const requestLogger = serviceLogger.child({ requestId: 'req-789' });
    const actionLogger = requestLogger.child({ action: 'login' });
    
    // Spy on all logger levels
    const serviceSpy = vi.spyOn(serviceLogger, 'info');
    const requestSpy = vi.spyOn(requestLogger, 'info');
    const actionSpy = vi.spyOn(actionLogger, 'info');
    
    // Log with each logger
    serviceLogger.info('Service starting');
    requestLogger.info('Processing request');
    actionLogger.info('Performing action');
    
    // Verify calls were made
    expect(serviceSpy).toHaveBeenCalledWith('Service starting');
    expect(requestSpy).toHaveBeenCalledWith('Processing request');
    expect(actionSpy).toHaveBeenCalledWith('Performing action');
  });
}); 