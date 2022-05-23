import request from 'supertest';
import app from '../../src/app.js'
import httpStatus from 'http-status';
import assert from 'assert';
import mockDB from '../utils/mockDB.js';

describe('Vehicle routes', () => {
    before(async () => {
        return await mockDB.start();

    })
    after(async () => {
        return await mockDB.stop();
    })
    describe('POST /api/vehicle', () => {
        it('given valid request when send request then should return 201 and created data', async () => {
            const newVehicle = {
                licence_plate: 'new car'
            }
            const res = await request(app).post('/api/vehicle').send(newVehicle).expect(httpStatus.CREATED);
            assert.ok(typeof res.body === 'object');
        });

        it('given invalid request when send request then should return 400', async () => {
            const newVehicle = {
                invalidProp: 'tester'
            }
            await request(app).post('/api/vehicle').send(newVehicle).expect(httpStatus.BAD_REQUEST);
        });
    })
})