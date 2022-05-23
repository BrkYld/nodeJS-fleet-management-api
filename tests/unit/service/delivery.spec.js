import deliveryService, { checkBagStatus, unloadDelivery } from '../../../src/service/delivery.js';
import assert from 'assert';
import mockDB from '../../utils/mockDB.js';
import { bagRepository, deliveryPointRepository, logRepository, packetRepository } from '../../../src/repository/index.js'
import { bagFixture, deliveryPointFixture, packetFixture, vehicleFixture } from '../../fixture/index.js';
import Enums from '../../../src/enums/index.js';

describe("Delivery Service Unit Test", async () => {
    before(async () => {
        return await mockDB.start();
    });
    after(async () => {
        return await mockDB.stop();
    });
    describe("Auto update bag status", async () => {
        before(async () => {
            return await mockDB.refresh();
        })
        it("given bag with status of all packets 'unloaded' when call checkBagStatus then bag status should be 'unloaded' ", async () => {
            const packets = await packetRepository.create(packetFixture)
            await bagRepository.create([bagFixture.unload_one])
            await bagRepository.addPacket(bagFixture.unload_one.barcode, packets[0].id)
            await bagRepository.addPacket(bagFixture.unload_one.barcode, packets[1].id)
            await packetRepository.updateStatus(packets[0].barcode, Enums.deliveryStatus.Unloaded)
            await packetRepository.updateStatus(packets[1].barcode, Enums.deliveryStatus.Unloaded)
            await checkBagStatus(bagFixture.unload_one.barcode)
            const result = await bagRepository.getByBarcode(bagFixture.unload_one.barcode)
            assert.ok(result.status === Enums.deliveryStatus.Unloaded)
        })
    });
    describe("unload delivery to delivery point", async () => {
        beforeEach(async () => {
            return await mockDB.refresh();
        })
        it("given packet with correct delivery point when call unloadDelivery then delivery status should be 'unloaded'", async () => {
            const packets = await packetRepository.create(packetFixture)
            const deliveryPoint = await deliveryPointRepository.create(deliveryPointFixture.value_one)
            let result = await unloadDelivery(packets[0], deliveryPoint)
            assert.ok(result.state === Enums.deliveryStatus.Unloaded)
            result = await packetRepository.getByBarcode(packets[0].barcode)
            assert.ok(result.status === Enums.deliveryStatus.Unloaded)
        });
        it("given packet with incorrect delivery point when call unloadDelivery then delivery status should not be 'unloaded' then log should be created in db", async () => {
            const packets = await packetRepository.create(packetFixture)
            const deliveryPoint = await deliveryPointRepository.create(deliveryPointFixture.value_one)
            let result = await unloadDelivery(packets[3], deliveryPoint)
            assert.ok(result.state === packets[3].status)
            result = await packetRepository.getByBarcode(packets[3].barcode)
            assert.ok(result.status !== Enums.deliveryStatus.Unloaded)
            const log = await logRepository.getAll();
            assert.ok(log[0].stack.delivery.barcode === packets[3].barcode)
        });
        it("given bag with packets correct delivery point when call unloadDelivery then delivery and packets status should be 'unloaded'", async () => {
            const packets = await packetRepository.create(packetFixture)
            await bagRepository.create(bagFixture.unload_one)
            const deliveryPoint = await deliveryPointRepository.create(deliveryPointFixture.value_three)
            await bagRepository.addPacket(bagFixture.unload_one.barcode, packets[0].id)
            await bagRepository.addPacket(bagFixture.unload_one.barcode, packets[1].id)
            const bag = await bagRepository.getByBarcode(bagFixture.unload_one.barcode);
            let result = await unloadDelivery(bag, deliveryPoint)
            assert.ok(result.state === Enums.deliveryStatus.Unloaded)
            result = await bagRepository.getByBarcode(bag.barcode)
            assert.ok(result.status === Enums.deliveryStatus.Unloaded)
            result.packets.map(packet => {
                assert.ok(packet.status === Enums.deliveryStatus.Unloaded)
            })
        });
    });

    describe("load packets into bag", async () => {
        beforeEach(async () => {
            return await mockDB.refresh();
        })
        it("given packet and bag with correct delivery point when call loadIntoBag then should see packet in bag then packet status should be 'Load into bag'", async () => {
            const packets = await packetRepository.create(packetFixture)
            await bagRepository.create(bagFixture.unload_one)
            await deliveryService.loadIntoBag(bagFixture.unload_one.barcode, [packets[0].barcode])
            const bag = await bagRepository.getByBarcode(bagFixture.unload_one.barcode);
            assert.ok(bag.packets[0].barcode === packets[0].barcode)
            let result = await packetRepository.getByBarcode(packets[0].barcode)
            assert.ok(result.status === Enums.deliveryStatus.Loaded_Into_Bag)
        });
        it("given packet with status 'Loaded into bag' and bag with correct delivery point when call loadIntoBag then should return error", async () => {
            const packets = await packetRepository.create(packetFixture)
            await bagRepository.create(bagFixture.unload_one)
            await packetRepository.updateStatus(packets[0].barcode, Enums.deliveryStatus.Loaded_Into_Bag)
            const result = await deliveryService.loadIntoBag(bagFixture.unload_one.barcode, [packets[0].barcode])
            assert.ok(Array.isArray(result.error))
            assert.ok(result.error.length > 0)
            assert.ok(result.message === 'Some packets could not be loaded')
        });
        it("given packet and bag with incorrect delivery point when call loadIntoBag then should return error", async () => {
            const packets = await packetRepository.create(packetFixture)
            await bagRepository.create(bagFixture.unload_one)
            const result = await deliveryService.loadIntoBag(bagFixture.unload_one.barcode, [packets[3].barcode])
            assert.ok(Array.isArray(result.error))
            assert.ok(result.error.length > 0)
            assert.ok(result.message === 'Some packets could not be loaded')
        });
    });

    describe("load deliveries to vehicle for distribution", async () => {
        beforeEach(async () => {
            return await mockDB.refresh();
        })
        it("given correct transaction data when call checkForDistribution then should all deliveries status to be 'Loaded'", async () => {
            let packets = await packetRepository.create(packetFixture);
            await deliveryPointRepository.create(deliveryPointFixture.value_one)
            const transactionData = {
                plate: vehicleFixture.licence_plate,
                route: [
                    {
                        deliveryPoint: 1,
                        deliveries: [
                            {
                                barcode: packets[0].barcode
                            },
                            {
                                barcode: packets[1].barcode
                            },
                            {
                                barcode: packets[2].barcode
                            },
                        ]
                    }
                ]
            }
            await deliveryService.checkForDistribution(transactionData)
            let packet = await packetRepository.getByBarcode(packets[0].barcode)
            assert.ok(packet.status === Enums.deliveryStatus.Loaded)
            packet = await packetRepository.getByBarcode(packets[1].barcode)
            assert.ok(packet.status === Enums.deliveryStatus.Loaded)
            packet = await packetRepository.getByBarcode(packets[2].barcode)
            assert.ok(packet.status === Enums.deliveryStatus.Loaded)
        });
    })

    describe("start distribution transaction", async () => {
        beforeEach(async () => {
            return await mockDB.refresh();
        })
        it("given correct transaction data when call distributionTransaction then should all deliveries status to be 'unloaded'", async () => {
            let packets = await packetRepository.create(packetFixture);
            await deliveryPointRepository.create(deliveryPointFixture.value_one)
            const transactionData = {
                plate: vehicleFixture.licence_plate,
                route: [
                    {
                        deliveryPoint: 1,
                        deliveries: [
                            {
                                barcode: packets[0].barcode
                            },
                            {
                                barcode: packets[1].barcode
                            },
                            {
                                barcode: packets[2].barcode
                            },
                        ]
                    }
                ]
            }
            await deliveryService.distributionTransaction(transactionData)
            let packet = await packetRepository.getByBarcode(packets[0].barcode)
            assert.ok(packet.status === Enums.deliveryStatus.Unloaded)
            packet = await packetRepository.getByBarcode(packets[1].barcode)
            assert.ok(packet.status === Enums.deliveryStatus.Unloaded)
            packet = await packetRepository.getByBarcode(packets[2].barcode)
            assert.ok(packet.status === Enums.deliveryStatus.Unloaded)
        });
    })

});
