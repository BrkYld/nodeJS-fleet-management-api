import deliveryPointService from '../../../src/service/deliveryPoint.js';
import assert from 'assert';
import mockDB from '../../utils/mockDB.js';
import { deliveryPointFixture } from '../../fixture/index.js';

describe("Delivery Point Service Unit Test", async () => {
    before(async () => {
        return await mockDB.start();
    });
    after(async () => {
        return await mockDB.stop();
    });
    it('when call getDeliveryPoints then should get all deliveryPoints item', async () => {
        const data = await deliveryPointService.getDeliveryPoints();
        assert.ok(Array.isArray(data));
    });
    it('given valid params when call createDeliveryPoint should return object', async () => {
        const data = await deliveryPointService.createDeliveryPoint(deliveryPointFixture.value_one);
        assert.ok(typeof data === 'object')
    });
});
