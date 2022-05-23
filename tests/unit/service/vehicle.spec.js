import vehicleService from '../../../src/service/vehicle.js';
import assert from 'assert';
import mockDB from '../../utils/mockDB.js';
import { vehicleFixture } from '../../fixture/index.js';

describe("Vehicle Service Unit Test", async () => {
    before(async () => {
        return await mockDB.start();
    });
    after(async () => {
        return await mockDB.stop();
    });
    it('given valid params when call createVehicle should return object', async () => {
        const data = await vehicleService.createVehicle(vehicleFixture);
        assert.ok(typeof data === 'object')
    });
});
