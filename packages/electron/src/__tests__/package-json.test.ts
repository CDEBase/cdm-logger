import * as path from 'path';
import * as packageJson from '../package-json';

describe('package-json', function () {
    describe('tryReadJsonAt', function () {
        it('should resolve data when child path specified', () => {
            let json = packageJson.tryReadJsonAt(__filename);

            expect(json.name).toBe('@cdm-logger/electron');
            expect(json.version).toMatch(/\d+\.\d+\.\d+/);
        });

        it('should resolve data when root specified', () => {
            let rootPath = path.join(__dirname, '../../../..');
            let json = packageJson.tryReadJsonAt(rootPath);

            expect(json.name).toBe('cdm-logger');
            expect(json.version).toMatch(/\d+\.\d+\.\d+/);
        });

        it('should return null on fail', () => {
            let json = packageJson.tryReadJsonAt('/');

            expect(json).toBe(null);
        });
    })
})