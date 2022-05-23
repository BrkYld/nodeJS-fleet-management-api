import request from 'supertest';
import app from '../../src/app.js'
import httpStatus from 'http-status';
import assert from 'assert';
import mockDB from '../utils/mockDB.js';

describe('Delivery Point routes', () => {
    before(async () => {
        return await mockDB.start();

    })
    after(async () => {
        return await mockDB.stop();
    })
    describe('POST /api/delivery-point', () => {
        it('given valid request when send request then should return 201 and created data then value property should be auto increed', async () => {
            let newDeliveryPoint = {
                name: 'testPoint',
                allow_to_unload: ['test']
            }
            let res = await request(app).post('/api/delivery-point').send(newDeliveryPoint).expect(httpStatus.CREATED);
            assert.ok(typeof res.body === 'object');
            assert.ok(res.body.data.value === 1)
            newDeliveryPoint = {
                name: 'testPoint2',
                allow_to_unload: ['test']
            }
            res = await request(app).post('/api/delivery-point').send(newDeliveryPoint).expect(httpStatus.CREATED);
            assert.ok(typeof res.body === 'object');
            assert.ok(res.body.data.value === 2)
        });

        it('given invalid request when send request then should return 400', async () => {
            let newDeliveryPoint = {
                invalidProp: 'tester'
            }
            await request(app).post('/api/delivery-point').send(newDeliveryPoint).expect(httpStatus.BAD_REQUEST);
            newDeliveryPoint = {
                name: 'tester',
                value: 5
            }
            await request(app).post('/api/delivery-point').send(newDeliveryPoint).expect(httpStatus.BAD_REQUEST);
        });
    })
    describe('GET /api/delivery-point', () => {
        it('given valid request when send request then should return 200 and all deliveryPoints', async () => {
            const res = await request(app).get('/api/delivery-point').send().expect(httpStatus.OK);
            assert.ok(typeof res.body === 'object');
            assert.ok(Array.isArray(res.body.data));
        });
    })
})