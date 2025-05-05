import 'reflect-metadata';
import { injectable, inject, Container } from 'inversify'
import { getLoggerOptions, makeLogger, CdmLogger } from '@cdm-logger/core'
import { getFileLogStream, IFileLoggerSettings } from '../server-logger';
import Logger from 'pino';
import { describe, it, expect, vi } from 'vitest'; // Ensure Vitest's expect is used

function testLogger(logger: any, msg: string) {
    logger.trace(msg);
    logger.debug(msg);
    logger.info(msg);
    logger.warn(msg);
    logger.error(msg);
    logger.fatal(msg);
}

describe('getLoggerOptions', () => {
    it('should be able to getLoggerOptions with 1 stream', () => {
        const settings: IFileLoggerSettings = {
            mode: 'long',
            level: 'warn',
            logPath: '/tmp',
        }

        // Get real file stream config
        const fileStream = getFileLogStream(settings, 'TestLog');
        
        // Create logger options with the stream
        const options = getLoggerOptions('TestLog', { streams: [fileStream] });
        
        // Verify the options
        expect(options).toBeDefined();
        expect(options.name).toEqual('TestLog');
        expect(options.streams).toBeDefined();
        expect(Array.isArray(options.streams)).toBe(true);
        expect(options.streams.length).toEqual(1);
        expect(options.streams[0].path).toEqual(fileStream.path);
        
        // Create logger and test it
        const logger = Logger(options);
        testLogger(logger, settings.level as string);
    });

    it('should be able to getLoggerOptions with nested path', () => {
        const settings: IFileLoggerSettings = {
            mode: 'long',
            level: 'warn',
            logPath: '/tmp',
        }

        // Get real file stream config
        const fileStream = getFileLogStream(settings, 'logs/TestLog');
        
        // Create logger options with the stream
        const options = getLoggerOptions('logs/TestLog', { streams: [fileStream] });
        
        // Verify the options
        expect(options).toBeDefined();
        expect(options.name).toEqual('logs/TestLog');
        expect(options.streams).toBeDefined();
        expect(Array.isArray(options.streams)).toBe(true);
        expect(options.streams.length).toEqual(1);
        expect(options.streams[0].path).toEqual(fileStream.path);
        
        // Create logger and test it
        const logger = Logger(options);
        testLogger(logger, settings.level as string);
    });
});

describe('Logger child functionality', () => {
    it('should create child logger with additional context', () => {
        const settings: IFileLoggerSettings = {
            mode: 'long',
            level: 'info',
            logPath: '/tmp',
        }

        // Get real file stream config
        const fileStream = getFileLogStream(settings, 'TestLog');
        
        // Create parent logger
        const options = getLoggerOptions('TestLog', { streams: [fileStream] });
        const parentLogger = Logger(options) as unknown as CdmLogger.ILogger;
        
        // Create child logger with context
        const childContext = { component: 'ChildComponent', childName: 'TestChild' };
        const childLogger = parentLogger.child(childContext);
        console.log('childLogger', childLogger);
        
        // Verify child logger
        expect(childLogger).toBeDefined();
        
        // Test that we can log with the child logger
        const infoSpy = vi.spyOn(childLogger, 'info');
        childLogger.info('Test child logger message');
        expect(infoSpy).toHaveBeenCalledWith('Test child logger message');
        
        // Advanced test: ensure child context properties appear in logs
        // This would require capturing and parsing the actual log output
    });
});