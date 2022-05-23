import vehicle from './vehicle.js';
import deliveryPoint from './deliveryPoint.js';
import packet from './packet.js';
import bag from './bag.js';
import log from './log.js';

const vehicleRepository = vehicle;
const deliveryPointRepository = deliveryPoint;
const packetRepository = packet;
const bagRepository = bag;
const logRepository = log;

export {
    vehicleRepository,
    deliveryPointRepository,
    packetRepository,
    bagRepository,
    logRepository
}