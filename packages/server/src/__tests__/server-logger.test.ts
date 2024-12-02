
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

        // Mock getFileLogStream to return a valid stream object
        const mockStream = { path: '/tmp/TestLog.log' };
        vi.spyOn({ getFileLogStream }, 'getFileLogStream').mockReturnValue(mockStream);

        const options = getLoggerOptions('TestLog', [mockStream]);
        expect(options).not.toBeUndefined();
        expect(options).not.toBeNull();
        expect(options.streams.length).toEqual(1);
        expect(options.name).toEqual('TestLog');
        expect(options.streams[0].path).toEqual(`/tmp/TestLog.log`);
        testLogger(Logger(options), settings.level as string)
    });

    it('should be able to getLoggerOptions with nested path', () => {
        const settings: IFileLoggerSettings = {
            mode: 'long',
            level: 'warn',
            logPath: '/tmp',
        }

        // Mock getFileLogStream to return a valid stream object
        const mockStream = { path: '/tmp/logs/TestLog.log' };
        vi.spyOn({ getFileLogStream }, 'getFileLogStream').mockReturnValue(mockStream);

        const options = getLoggerOptions('logs/TestLog', [mockStream]);
        expect(options).not.toBeUndefined();
        expect(options).not.toBeNull();
        expect(options.streams.length).toEqual(1);
        expect(options.name).toEqual('logs/TestLog');
        expect(options.streams[0].path).toEqual(`/tmp/logs/TestLog.log`);
        testLogger(Logger(options), settings.level as string)
    });

});