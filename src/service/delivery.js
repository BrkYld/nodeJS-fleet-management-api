import httpStatus from "http-status";
import logger from '../config/logger.js'
import Enums from "../enums/index.js";
import { packetRepository, bagRepository, deliveryPointRepository, logRepository } from "../repository/index.js";
import ApiError from "../utils/ApiError.js";

const getDeliveryType = async (barcode) => {
    const packet = await packetRepository.getByBarcode(barcode);
    if (packet) {
        return packet;
    }

    return await bagRepository.getByBarcode(barcode);
}

export const checkBagStatus = async (bagBarcode) => {
    if (bagBarcode) {
        const bag = await bagRepository.getByBarcode(bagBarcode)
        const { packets } = bag;
        const loadedPackets = packets.filter(packet => packet.status !== Enums.deliveryStatus.Unloaded)
        if (loadedPackets.length === 0) {
           await bagRepository.updateStatus(bagBarcode, Enums.deliveryStatus.Unloaded)
        }
    }
}

export const unloadDelivery = async (delivery, deliveryPoint) => {
    const { allow_to_unload, value } = deliveryPoint;
    const { delivery_point_for_unloading, type, status, barcode, packets, bagBarcode } = delivery;
    if ((!allow_to_unload.includes(type) && !bagBarcode) || value !== delivery_point_for_unloading) {
        logRepository.create({
            description: "Incorrect barcode - delivery point",
            stack: {
                delivery,
                deliveryPoint
            }
        })
        return { state: status }
    }
    switch (type) {
        case 'packet':
            await packetRepository.updateStatus(barcode, Enums.deliveryStatus.Unloaded)
            await checkBagStatus(bagBarcode);
            break;
        case 'bag':
            await bagRepository.updateStatus(barcode, Enums.deliveryStatus.Unloaded)
            packets.map(async packet => {
                await packetRepository.updateStatus(packet.barcode, Enums.deliveryStatus.Unloaded)
            })
            break;
    }
    return { state: Enums.deliveryStatus.Unloaded }
}


export default {
    getDeliveries: async () => {
        const packets = await packetRepository.getAll();
        const bags = await bagRepository.getAll();
        return [...packets, ...bags];
    },
    getByType: async (type) => {
        type = type.toLowerCase()
        switch (type) {
            case 'packet':
                return await packetRepository.getAll()
            case 'bag':
                return await bagRepository.getAll()
            default:
                return []
        }
    },
    getByStatus: async status => {
        const packets = await packetRepository.getByStatus(status);
        const bags = await bagRepository.getByStatus(status);
        return [...packets, ...bags];
    },
    createPacket: async newPacket => {
        const error = []
        const success = [];
        let added;
        await Promise.all(newPacket.map(async packet => {
            try {
                await packetRepository.create(packet)
                added = await packetRepository.updateStatus(packet.barcode, Enums.deliveryStatus.Created)
                success.push(added);
            } catch (err) {
                error.push({ message: err.message, packet });
            }
        }))
        if (error.length > 0) {
            logRepository.create({
                description: 'Some packets could not be created',
                stack: error
            })
            return { message: 'Some packets could not be created', error, success }
        }
        return success;
    },
    createBag: async newBag => {
        const error = []
        const success = [];
        let added;
        await Promise.all(newBag.map(async bag => {
            try {
                await bagRepository.create(bag)
                added = await bagRepository.updateStatus(bag.barcode, Enums.deliveryStatus.Created)
                success.push(added);
            } catch (err) {
                error.push({ message: err.message, bag });
            }
        }))
        if (error.length > 0) {
            logRepository.create({
                description: 'Some bags could not be created',
                stack: error
            })
            return { message: 'Some bags could not be created', error, success }
        }
        return success;
    },
    loadIntoBag: async (bagBarcode, packetBarcodes) => {
        let bag = await bagRepository.getByBarcode(bagBarcode);
        if (!bag) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Bag not found")
        }
        const error = [];
        const success = [];
        await Promise.all(packetBarcodes.map(async packetBarcode => {
            try {
                const packet = await packetRepository.getByBarcode(packetBarcode);
                if (!packet) {
                    throw new ApiError(httpStatus.BAD_REQUEST, "Packet not found")
                }
                if (packet.status !== Enums.deliveryStatus.Created) {
                    throw new ApiError(httpStatus.BAD_REQUEST, "Packet already loaded or unloaded")
                }
                if (packet.delivery_point_for_unloading !== bag.delivery_point_for_unloading) {
                    throw new ApiError(httpStatus.BAD_REQUEST, "The packages loaded into a bag must have the same delivery point as the bag.")
                }

                await bagRepository.addPacket(bagBarcode, packet.id)
                await packetRepository.updateStatus(packetBarcode, Enums.deliveryStatus.Loaded_Into_Bag)
                packetRepository.updateBagBarcode(packetBarcode, bagBarcode)
                success.push(packetBarcode)
            } catch (err) {
                error.push({ message: err.message, packetBarcode });
            }
        }))

        if (error.length > 0) {

            logRepository.create({
                description: 'Some packets could not be loaded',
                stack: error
            })
            return { message: 'Some packets could not be loaded', error, success }
        }

        return success;
    },
    checkForDistribution: async transactionData => {
        await Promise.all(transactionData.route.map(async route => {
            await Promise.all(route.deliveries.map(async deliveryItem => {
                const { barcode } = deliveryItem;
                const deliveryType = await getDeliveryType(barcode);
                switch (deliveryType.type) {
                    case 'packet':
                        await packetRepository.updateStatus(barcode, Enums.deliveryStatus.Loaded);
                        break;
                    case 'bag':
                        await bagRepository.updateStatus(barcode, Enums.deliveryStatus.Loaded)
                        deliveryType.packets.map(async packet => {
                            await packetRepository.updateStatus(packet.barcode, Enums.deliveryStatus.Loaded)
                        })
                }
            }))
        }))
        logger.info("All deliveries ready for distribution")
    },
    distributionTransaction: async transactionData => {
        let distributionResult = { plate: transactionData.plate, route: [] };

        await Promise.all(transactionData.route.map(async (route, index) => {
            let routeResult = { deliveryPoint: route.deliveryPoint, deliveries: [] }

            const deliveryPoint = await deliveryPointRepository.getByValue(route.deliveryPoint)

            await Promise.all(route.deliveries.map(async (deliveryItem, index) => {
                const { barcode } = deliveryItem;
                const delivery = await getDeliveryType(barcode);
                let result = await unloadDelivery(delivery, deliveryPoint);
                routeResult.deliveries[index] = { ...deliveryItem, ...result };
            }))

            distributionResult.route[index] = routeResult;
        }))
        return distributionResult;
    }
}