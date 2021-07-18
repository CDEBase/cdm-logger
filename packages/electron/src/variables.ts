import * as os from 'os';
import * as path from 'path';
import * as electronApi from './electron-api';
import * as packageJson from './package-json';

function getAppData(platform) {
    var appData = electronApi.getPath('appData');
    if (appData) {
        return appData;
    }

    var home = getHome();

    switch (platform) {
        case 'darwin': {
            return path.join(home, 'Library/Application Support');
        }

        case 'win32': {
            return process.env.APPDATA || path.join(home, 'AppData/Roaming');
        }

        default: {
            return process.env.XDG_CONFIG_HOME || path.join(home, '.config');
        }
    }
}

function getHome() {
    return os.homedir ? os.homedir() : process.env.HOME;
}

function getLibraryDefaultDir(platform, appName) {
    if (platform === 'darwin') {
        return path.join(getHome(), 'Library/Logs', appName);
    }

    return path.join(getUserData(platform, appName), 'logs');
}

function getLibraryTemplate(platform) {
    if (platform === 'darwin') {
        return path.join(getHome(), 'Library/Logs', '{appName}');
    }

    return path.join(getAppData(platform), '{appName}', 'logs');
}

function getNameAndVersion() {
    var name = electronApi.getName() || '';
    var version = electronApi.getVersion();

    if (name.toLowerCase() === 'electron') {
        name = '';
        version = '';
    }

    if (name && version) {
        return { name: name, version: version };
    }

    var packageValues = packageJson.readPackageJson();
    if (!name) {
        name = packageValues.name;
    }

    if (!version) {
        version = packageValues.version;
    }

    return { name: name, version: version };
}

/**
 * @param {string} platform
 * @return {PathVariables}
 */
function getPathVariables(platform) {
    var nameAndVersion = getNameAndVersion();
    var appName = nameAndVersion.name;
    var appVersion = nameAndVersion.version;

    return {
        appData: getAppData(platform),
        appName: appName,
        appVersion: appVersion,
        electronDefaultDir: electronApi.getPath('logs'),
        home: getHome(),
        libraryDefaultDir: getLibraryDefaultDir(platform, appName),
        libraryTemplate: getLibraryTemplate(platform),
        temp: electronApi.getPath('temp') || os.tmpdir(),
        userData: getUserData(platform, appName),
    };
}

function getUserData(platform, appName) {
    if (electronApi.getName() !== appName) {
        return path.join(getAppData(platform), appName);
    }

    return electronApi.getPath('userData')
        || path.join(getAppData(platform), appName);
}

export {
    getAppData,
    getLibraryDefaultDir,
    getLibraryTemplate,
    getNameAndVersion,
    getPathVariables,
    getUserData,
}