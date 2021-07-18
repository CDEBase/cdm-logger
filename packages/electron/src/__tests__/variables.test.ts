import * as os from 'os';
import * as path from 'path';
import * as variables from '../variables';
var humilePkg = require('../../../../package.json');
describe('variables', () => {
    describe('getAppData', () => {
        expect(variables.getAppData('linux')).toBe(
            path.join(os.homedir(), '.config'),
        );
    });

    it('on macOS', () => {
        expect(variables.getAppData('darwin')).toBe(
            path.join(os.homedir(), 'Library/Application Support'),
        );
    });

    it('on Windows', () => {
        expect(variables.getAppData('win32')).toBe(
            path.join(os.homedir(), 'AppData', 'Roaming'),
        );
    });

    describe('getLibraryDefaultDir', () => {
        it('on Linux', () => {
            expect(variables.getLibraryDefaultDir('linux', 'electron-log')).toBe(
                path.join(os.homedir(), '.config/electron-log/logs')
            );
        });

        it('on macOS', () => {
            expect(variables.getLibraryDefaultDir('darwin', 'electron-log')).toBe(
                path.join(os.homedir(), 'Library/Logs/electron-log'),
            );
        });

        it('on Windows', () => {
            expect(variables.getLibraryDefaultDir('win32', 'electron-log')).toBe(
                path.join(os.homedir(), 'AppData', 'Roaming', 'electron-log', 'logs'),
            );
        });
    });

    describe('getLibraryTemplate', () => {
        it('on Linux', () => {
            expect(variables.getLibraryTemplate('linux')).toBe(
                path.join(os.homedir(), '.config/{appName}/logs')
            );
        });

        it('on macOS', () => {
            expect(variables.getLibraryTemplate('darwin')).toBe(
                path.join(os.homedir(), 'Library/Logs/{appName}')
            );
        });

        it('on Windows', () => {
            expect(variables.getLibraryTemplate('win32')).toBe(
                path.join(os.homedir(), 'AppData', 'Roaming', '{appName}', 'logs'),
            );
        });
    });

    it('getNameAndVersion', () => {
        let nameAndVersion = variables.getNameAndVersion();

        expect(nameAndVersion.name).toBe('cdm-logger');
        expect(nameAndVersion.version).toMatch(/\d+\.\d+\.\d+/);
    });

    describe('getPathVariables', () => {
        it('on Linux', () => {
            var appData = path.join(os.homedir(), '.config');

            expect(variables.getPathVariables('linux')).toEqual({
                appData: appData,
                appName: 'cdm-logger',
                appVersion: humilePkg.version,
                electronDefaultDir: null, // test runned not in electron
                home: os.homedir(),
                libraryDefaultDir: path.join(appData, 'cdm-logger/logs'),
                libraryTemplate: path.join(appData, '{appName}/logs'),
                temp: os.tmpdir(),
                userData: path.join(appData, 'cdm-logger'),
            });
        });

        it('on macOS', function () {
            var appData = path.join(os.homedir(), 'Library/Application Support');

            expect(variables.getPathVariables('darwin')).toEqual({
                appData: appData,
                appName: 'cdm-logger',
                appVersion: humilePkg.version,
                electronDefaultDir: null, // test runned not in electron
                home: os.homedir(),
                libraryDefaultDir: path.join(os.homedir(), 'Library/Logs/cdm-logger'),
                libraryTemplate: path.join(os.homedir(), 'Library/Logs/{appName}'),
                temp: os.tmpdir(),
                userData: path.join(appData, 'cdm-logger'),
            });
        });

        it('on Windows', function () {
            var appData = path.join(os.homedir(), 'AppData', 'Roaming');

            expect(variables.getPathVariables('win32')).toEqual({
                appData: appData,
                appName: 'cdm-logger',
                appVersion: humilePkg.version,
                electronDefaultDir: null, // test runned not in electron
                home: os.homedir(),
                libraryDefaultDir: path.join(appData, 'cdm-logger', 'logs'),
                libraryTemplate: path.join(appData, '{appName}/logs'),
                temp: os.tmpdir(),
                userData: path.join(appData, 'cdm-logger'),
            });
        });
    });

    describe('getUserData', function () {
        it('on Linux', function () {
            expect(variables.getUserData('linux', 'electron-log')).toBe(
                path.join(os.homedir(), '.config/electron-log')
            );
        });

        it('on macOS', function () {
            expect(variables.getUserData('darwin', 'electron-log')).toBe(
                path.join(os.homedir(), 'Library/Application Support/electron-log')
            );
        });

        it('on Windows', function () {
            expect(variables.getUserData('win32', 'electron-log')).toBe(
                path.join(os.homedir(), 'AppData', 'Roaming', 'electron-log')
            );
        });
    });
});
