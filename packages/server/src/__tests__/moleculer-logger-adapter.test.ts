import { describe, it, expect, vi } from 'vitest';
import { MoleculerLoggerAdapter } from '../adapters/moleculer-logger-adapter';

describe('MoleculerLoggerAdapter', () => {
  // Mock a Moleculer logger
  const createMockMoleculerLogger = () => ({
    trace: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  });

  it('should create an adapter with proper interface', () => {
    const mockLogger = createMockMoleculerLogger();
    const adapter = new MoleculerLoggerAdapter(mockLogger);
    
    expect(adapter).toBeDefined();
    expect(typeof adapter.child).toBe('function');
    expect(typeof adapter.trace).toBe('function');
    expect(typeof adapter.debug).toBe('function');
    expect(typeof adapter.info).toBe('function');
    expect(typeof adapter.warn).toBe('function');
    expect(typeof adapter.error).toBe('function');
    expect(typeof adapter.fatal).toBe('function');
  });

  it('should delegate log calls to underlying logger', () => {
    const mockLogger = createMockMoleculerLogger();
    const adapter = new MoleculerLoggerAdapter(mockLogger);
    
    adapter.info('Test message');
    expect(mockLogger.info).toHaveBeenCalledWith('Test message');
    
    adapter.error('Error message');
    expect(mockLogger.error).toHaveBeenCalledWith('Error message');
  });

  it('should create child loggers with metadata', () => {
    const mockLogger = createMockMoleculerLogger();
    const adapter = new MoleculerLoggerAdapter(mockLogger);
    
    const childLogger = adapter.child({ component: 'TestComponent' });
    expect(childLogger).toBeDefined();
    expect(childLogger).toBeInstanceOf(MoleculerLoggerAdapter);
    
    childLogger.info('Child logger message');
    expect(mockLogger.info).toHaveBeenCalledWith('[component=TestComponent] Child logger message');
  });

  it('should create nested child loggers with combined metadata', () => {
    const mockLogger = createMockMoleculerLogger();
    const adapter = new MoleculerLoggerAdapter(mockLogger);
    
    const childLogger = adapter.child({ component: 'TestComponent' });
    const grandchildLogger = childLogger.child({ method: 'testMethod' });
    
    grandchildLogger.debug('Grandchild logger message');
    expect(mockLogger.debug).toHaveBeenCalledWith('[component=TestComponent] [method=testMethod] Grandchild logger message');
  });

  it('should handle additional arguments in log methods', () => {
    const mockLogger = createMockMoleculerLogger();
    const adapter = new MoleculerLoggerAdapter(mockLogger);
    
    const childLogger = adapter.child({ component: 'TestComponent' });
    childLogger.info('Message with %s', 'placeholder');
    
    expect(mockLogger.info).toHaveBeenCalledWith('[component=TestComponent] Message with %s', 'placeholder');
  });
}); 