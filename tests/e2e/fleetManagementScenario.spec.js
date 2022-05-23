import request from 'supertest';
import app from '../../src/app.js'
import httpStatus from 'http-status';
import assert from 'assert';
import mockDB from '../utils/mockDB.js';
import { fleetManagementScenarioFixture } from '../fixture/index.js';
import { bagRepository, logRepository, packetRepository } from '../../src/repository/index.js';
import Enums from '../../src/enums/index.js';
import { deliveryService } from '../../src/service/index.js';


describe('e2e Fleet Management Scenario', async () => {
    let result;
    before(async () => {
        return await mockDB.start();
    })
    after(async () => {
        return await mockDB.stop();
    })
    it('Given vehicle', async () => {
        await request(app).post('/api/vehicle').send(fleetManagementScenarioFixture['/api/vehicle']).expect(httpStatus.CREATED);
    })
    it('Given delivery points', async () => {
        await request(app).post('/api/delivery-point').send(fleetManagementScenarioFixture['/api/delivery-point'][0]).expect(httpStatus.CREATED);
        await request(app).post('/api/delivery-point').send(fleetManagementScenarioFixture['/api/delivery-point'][1]).expect(httpStatus.CREATED);
        await request(app).post('/api/delivery-point').send(fleetManagementScenarioFixture['/api/delivery-point'][2]).expect(httpStatus.CREATED);
    })
    it('Given bags', async () => {
        await request(app).post('/api/delivery/bag').send(fleetManagementScenarioFixture['/api/delivery/bag']).expect(httpStatus.CREATED);
    })
    it('Given packets', async () => {
        await request(app).post('/api/delivery/packet').send(fleetManagementScenarioFixture['/api/delivery/packet']).expect(httpStatus.CREATED);
    })
    it('When load packets into bags', async () => {
        await request(app).put('/api/delivery/bag/C725800').send(fleetManagementScenarioFixture['/api/delivery/bag/C725800']).expect(httpStatus.OK);
        await request(app).put('/api/delivery/bag/C725799').send(fleetManagementScenarioFixture['/api/delivery/bag/C725799']).expect(httpStatus.OK);
    })
    it('When start transaction', async () => {
        result = await request(app).post('/api/delivery').send(fleetManagementScenarioFixture.transactionData);
    })
    it('Then result should same as expected result', async () => {
        const actual = result.body.data;
        const expected = fleetManagementScenarioFixture.expectedResult;
        assert.deepEqual(expected, actual);
    })
    it('Then incorrect delivery-barcode couples should be logged to db', async () => {
        let logs = await logRepository.getAll();
        logs = logs.filter(log => log.description === 'Incorrect barcode - delivery point')
        assert.ok(logs.length === 5)
    })
    it('Then status of loaded and unloaded deliveries should be displayed in db', async () => {
        let deliveries = await deliveryService.getByStatus(Enums.deliveryStatus.Unloaded);
        assert.ok(deliveries.length === 12)
        deliveries = await deliveryService.getByStatus(Enums.deliveryStatus.Loaded);
        assert.ok(deliveries.length === 4)
    })
    it('Then delivery which barcode number is "P8988000120" status should be "created" ', async () => {
        const packet = await packetRepository.getByBarcode('P8988000120');
        assert.ok(packet.status === Enums.deliveryStatus.Created)
    })
    it('Then deliveries which barcode number is "P8988000121" and "C725799" should be logged to db" ', async () => {
        const logs = await logRepository.getAll();
        let log = logs.find(log => log.stack.delivery.barcode === "P8988000121");
        assert.ok(log.description === 'Incorrect barcode - delivery point');
        log = logs.find(log => log.stack.delivery.barcode === "C725799");
        assert.ok(log.description === 'Incorrect barcode - delivery point');
    })
    it('Then delivery which barcode number is "P8988000121" status should be "loaded" ', async () => {
        const packet = await packetRepository.getByBarcode('P8988000121');
        assert.ok(packet.status === Enums.deliveryStatus.Loaded)
    })
    it('Then delivery which barcode number is "C725800" status should be "unloaded" ', async () => {
        const bag = await bagRepository.getByBarcode('C725800');
        assert.ok(bag.status === Enums.deliveryStatus.Unloaded)
    })
    it('Then delivery which barcode number is "P8988000122" status should be "unloaded" ', async () => {
        const packet = await packetRepository.getByBarcode('P8988000122');
        assert.ok(packet.status === Enums.deliveryStatus.Unloaded)
    })
    it('Then delivery which barcode number is "P8988000126" status should be "unloaded" ', async () => {
        const packet = await packetRepository.getByBarcode('P8988000126');
        assert.ok(packet.status === Enums.deliveryStatus.Unloaded)
    })
})