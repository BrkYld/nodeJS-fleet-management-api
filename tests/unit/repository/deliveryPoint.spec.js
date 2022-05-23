import deliveryPointRepository from '../../../src/repository/deliveryPoint.js';
import assert from 'assert';
import mockDB from '../../utils/mockDB.js';

describe("Delivery Point Repository Unit Test", async () => {
    before(async () => {
        return await mockDB.start();
    });
    after(async () => {
        return await mockDB.stop();
    });
    it('given valid params with empty collection when call create value property should be 1', async () => {
        const deliveryPoints = await deliveryPointRepository.getAll();
        assert.ok(Array.isArray(deliveryPoints))
        assert.ok(deliveryPoints.length === 0)
        const data = await deliveryPointRepository.create({ name: 'new delivery point' });
        assert.ok(data.value === 1)
    });
    it('given valid params when call create value property value property should be auto increed', async () => {
        const data = await deliveryPointRepository.create({ name: 'new delivery point_2' });
        assert.ok(data.value === 2)
    });
});
