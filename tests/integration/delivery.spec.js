import request from 'supertest';
import app from '../../src/app.js'
import httpStatus from 'http-status';
import assert from 'assert';
import mockDB from '../utils/mockDB.js';

describe('Delivery routes', () => {
    before(async () => {
        return await mockDB.start();

    })
    after(async () => {
        return await mockDB.stop();
    })

    describe('POST /api/delivery/packet', () => {
        it('given valid body when send request then should return 201 and data', async () => {
            const newPacket =
                [
                    {
                        "barcode": "P7988000121",
                        "delivery_point_for_unloading": 1,
                        "volumetric_weight": 5
                    },
                    {
                        "barcode": "P7988000122",
                        "delivery_point_for_unloading": 1,
                        "volumetric_weight": 5
                    }
                ]

            const res = await request(app).post('/api/delivery/packet').send(newPacket).expect(httpStatus.CREATED);
            assert.ok(typeof res.body === 'object');
        });
        it('given invalid body when send request then should return 400 and error', async () => {
            const newPacket =
                [
                    {
                        "delivery_point_for_unloading": 1,
                        "volumetric_weight": 5
                    },
                    {
                        "barcode": "P7988000122",
                        "volumetric_weight": 5
                    }
                ]

            const res = await request(app).post('/api/delivery/packet').send(newPacket).expect(httpStatus.BAD_REQUEST);
            assert.ok(typeof res.body === 'object');
        });
    })
    describe('GET /api/delivery/packet', () => {
        it('when send request then should return 200 and packets', async () => {
            const res = await request(app).get('/api/delivery/packet').expect(httpStatus.OK);
            assert.ok(typeof res.body === 'object');
        });
    })
    describe('POST /api/delivery/bag', () => {
        it('given valid body when send request then should return 201 and data', async () => {
            const newBag = [
                {
                    "barcode": "C725799",
                    "delivery_point_for_unloading": 2
                },
                {
                    "barcode": "C725800",
                    "delivery_point_for_unloading": 3
                }
            ]

            const res = await request(app).post('/api/delivery/bag').send(newBag).expect(httpStatus.CREATED);
            assert.ok(typeof res.body === 'object');
        });
        it('given invalid body when send request then should return 400 and error', async () => {
            const newBag =
                [
                    {

                        "delivery_point_for_unloading": 2
                    },
                    {
                        "barcode": "C725800",
                    }
                ]

            const res = await request(app).post('/api/delivery/bag').send(newBag).expect(httpStatus.BAD_REQUEST);
            assert.ok(typeof res.body === 'object');
        });
    })
    describe('GET /api/delivery/bag', () => {
        it('when send request then should return 200 and bags', async () => {
            const res = await request(app).get('/api/delivery/bag').expect(httpStatus.OK);
            assert.ok(typeof res.body === 'object');
        });
    })
    describe('PUT /api/delivery/bag/:bagBarcode', () => {
        it('given invalid bagBarcode and valid request body when send request then should return 400 and error', async () => {
            const body = [
                "P9988000128",
                "P9988000129"
            ]
            const res = await request(app).put('/api/delivery/bag/C7258005').send(body).expect(httpStatus.BAD_REQUEST);
            assert.ok(typeof res.body === 'object');
        });
        it('given valid bagBarcode and invalid request body when send request then should return 400 and error', async () => {
            const body = [
                5,
                "P9988000129"
            ]
            const res = await request(app).put('/api/delivery/bag/C725800').send(body).expect(httpStatus.BAD_REQUEST);
            assert.ok(typeof res.body === 'object');
        });
        it('given valid when send request then should return 200', async () => {
            const body = [
                "P9988000128",
                "P9988000129"
            ]
            const res = await request(app).put('/api/delivery/bag/C725800').send(body).expect(httpStatus.OK);
            assert.ok(typeof res.body === 'object');
        });
    })
    describe('GET /api/delivery', () => {
        it('when send request then should return 200 and data', async () => {
            const res = await request(app).get('/api/delivery').expect(httpStatus.OK);
            assert.ok(typeof res.body === 'object');
        });
    })
    describe('POST /api/delivery', () => {
        it('given valid request when send request then should return 200 and data', async () => {
            const newDeliveryPoint = {
                name: 'testPoint',
                allow_to_unload: ['packet']
            }
            const newPacket = [
                {
                    "delivery_point_for_unloading" : 1,
                    "barcode": "P7988000121",
                    "volumetric_weight": 5
                }
            ]
            const transactionData = {
                "plate": "34 TL 34",
                "route": [
                    {
                        "deliveryPoint": 1,
                        "deliveries": [
                            {
                                "barcode": "P7988000121"
                            }
                        ]
                    },
                ]
            }
            await request(app).post('/api/delivery/packet').send(newPacket).expect(httpStatus.CREATED);
            await request(app).post('/api/delivery-point').send(newDeliveryPoint).expect(httpStatus.CREATED);
            const res = await request(app).post('/api/delivery').send(transactionData).expect(httpStatus.OK);
            assert.ok(typeof res.body === 'object');
        });
    })
})