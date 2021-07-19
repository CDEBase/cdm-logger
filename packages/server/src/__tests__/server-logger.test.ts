import 'reflect-metadata';
import { injectable, inject, Container } from 'inversify'
import { getFileLogStream, IFileLoggerSettings } from '../server-logger';
import { getLoggerOptions, makeLogger, CdmLogger } from '@cdm-logger/core'
import { createLogger } from 'bunyan';
import 'jest'

function testLogger(logger: CdmLogger.ILogger, msg: string) {
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

        const options = getLoggerOptions('TestLog', getFileLogStream(settings, 'TestLog'));
        expect(options).not.toBeUndefined;
        expect(options).not.toBeNull;
        expect(options.streams.length).toEqual(1);
        expect(options.name).toEqual('TestLog');
        expect(options.streams[0].path).toEqual(`/tmp/TestLog.log`);
        testLogger(createLogger(options), settings.level as string)
    });

    it('should be able to getLoggerOptions with nested path', () => {
        const settings: IFileLoggerSettings = {
            mode: 'long',
            level: 'warn',
            logPath: '/tmp',
        }

        const options = getLoggerOptions('logs/TestLog', getFileLogStream(settings, 'logs/TestLog'));
        expect(options).not.toBeUndefined;
        expect(options).not.toBeNull;
        expect(options.streams.length).toEqual(1);
        expect(options.name).toEqual('logs/TestLog');
        expect(options.streams[0].path).toEqual(`/tmp/logs/TestLog.log`);
        testLogger(createLogger(options), settings.level as string)
    });

});
